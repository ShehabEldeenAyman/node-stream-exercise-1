import { Stream, Writer } from "@rdfc/js-runner";
import { rdfParser } from "rdf-parse";
import { RdfStore } from "rdf-stores";
import { QueryEngine } from "@comunica/query-sparql-rdfjs";

import str from 'string-to-stream';

/**
 * rdf-connect processor to map entities with blank node identifiers to equivalents with named node identifiers.
 *
 * @param incoming The data stream which must be transformed.
 * @param outgoing The data stream into which the resulting stream is written.
 * @param mime The MIME type of the data stream.
 */
export function processor(
    incoming: Stream<string>,
    outgoing: Writer<string>,
    mime = "text/turtle",
): void {
    let count = 0;
    incoming.on("data", async (data) => {

        count ++;
        let store = RdfStore.createDefault();
        await new Promise((resolve, reject) => { 
            store.import(rdfParser.parse(str(data),{
                contentType: mime
            })).on("end", resolve).on("error", reject);
        });
        //you can now query the store using comunica
        const myEngine = new QueryEngine();
        const bindingsStream = await myEngine.queryBindings(`
            SELECT ?s ?p ?o WHERE {
              ?s ?p ?o
            } LIMIT 100`, {
            sources: [store],
          });
        const bindings = await bindingsStream.toArray();

        console.log(bindings[0]?.get('s')?.value);

        // Serialize the quads with named node identifiers.
        await outgoing.push('member ' +  count + 'processed\n');
    });

    // If a processor upstream terminates the channel, we propagate this change
    // onto the processors downstream.
    incoming.on("end", () => {
        outgoing.end();
    });
}
