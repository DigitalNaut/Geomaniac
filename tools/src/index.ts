// import fs from "fs/promises";
import axios from "axios";

import data from "../../src/assets/data/features-data.json";

async function runAsyncCode() {
  const [{ WIKIDATAID }] = data;

  const info = await axios.get(`https://www.wikidata.org/wiki/Special:EntityData/${WIKIDATAID}.json`);
  console.log(info);
}

runAsyncCode();
