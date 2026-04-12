import japUtils from 'japanese-string-utils';
import xml2js from 'xml2js';


const orcaUrl = process.env.OrcaUrl
const orcaUser = process.env.OrcaUser
const orcaPass = process.env.OrcaPass

const config = {
    headers: {
        "Content-Type": "text/xml",
    },
    auth: {
        username: orcaUser,
        password: orcaPass,
    },
    timeout: 10000,
};
const xmlOptions = {
    ignoreAttrs: true,
    explicitArray: false,
};

