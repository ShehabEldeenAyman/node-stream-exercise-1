const express = require('express')
const https = require('https');
const fs = require('fs');
const N3 = require('n3');


const port = 5000;
const url = 'https://waterkwaliteit-brugge-ldes.kindflower-25e41809.westeurope.azurecontainerapps.io/Waterkwaliteit/latestView?pageNumber=1';

/*
const readstream = fs.createReadStream('waterdata.txt','utf8');

readstream.on('data',(datapart)=>{
    console.log(`${datapart} \n`);
});

readstream.on('end',()=>{
    console.log('Done reading data');
});

readstream.on('error',(err)=>{
    console.log(`${err} \n`);
});
*/

const regexIsoDatetime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const regexBasicDate = /^\d{8}$/;


parser =  new N3.StreamParser();
rdfStream = fs.createReadStream('waterdata.ttl');
//parser.parse(rdfStream, console.log);

record_count=0;

parser.on('data',(quad)=>{
    record_count++;
    //console.log(`object: ${quad.object.value}`);
    //console.log(quad);
    if(quad.object.value.match(regexIsoDatetime)){
        console.log(`object: ${quad.object.value}`);
    }
});

parser.on('end',()=>{

    console.log(`total number of records: ${record_count}`);
});

parser.on('error',(err)=>{
    console.error(`${err.message}`);
});

rdfStream.pipe(parser);

rdfStream.on('error', (err) => {
    console.error(`Error reading the file: ${err.message}`);
  });

/*
rdfStream.on('data',(data_chunk)=>{
    record_count++;    

    //string_data = data_chunk.toString();

    //for (i=0;i<string_data.length;i++){
        //console.log(string_data[i]);
    //}
});
*/

/*
rdfStream.on('end',()=>{
    console.log(`number of records is: ${record_count}`);
});
*/

/*
rdfStream.on('error',(err)=>{
    console.log(`${err} \n`);
});
*/
