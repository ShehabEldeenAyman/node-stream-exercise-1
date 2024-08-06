import { rdfParser } from "rdf-parse";
import { RdfStore } from "rdf-stores";
import { QueryEngine } from "@comunica/query-sparql-rdfjs";
import str from 'string-to-stream';
export function processor(incoming, outgoing, mime = "text/turtle") {
    let count = 0;
    incoming.on("data", async (data) => {
        count++;
        let store = RdfStore.createDefault();
        await new Promise((resolve, reject) => {
            store.import(rdfParser.parse(str(data), {
                contentType: mime
            })).on("end", resolve).on("error", reject);
        });
        const myEngine = new QueryEngine();
        const bindingsStream = await myEngine.queryBindings(`
            SELECT ?s ?p ?o WHERE {
              ?s ?p ?o
            } LIMIT 100`, {
            sources: [store],
        });
        const bindings = await bindingsStream.toArray();
        console.log(bindings[0]?.get('o')?.value);
        await outgoing.push('member ' + count + 'processed\n');
    });
    incoming.on("end", () => {
        outgoing.end();
    });
}
