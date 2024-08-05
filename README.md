# Experiments with RDF Connect

The goal is to write a processor that can take in an LDES, and process it into something else.

## Install

```
npm install
```

## Building it

You need to have typescript installed. Then run

```
tsc
```

This will transpile index.ts into index.js

## Running it

An example pipeline is provided in fetch.ttl. Run it using the `js-runner`

```
npx @rdfc/js-runner fetch.ttl
```
