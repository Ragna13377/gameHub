import fs from 'fs';
const sslServerKey = '/etc/ssl/certs/certificate.key';
const sslServerCert = '/etc/ssl/certs/certificate.crt';
const sslServerCa = '/etc/ssl/certs/certificate_ca.crt';
export const certOptions = {
	key: fs.readFileSync(sslServerKey),
	cert: fs.readFileSync(sslServerCert),
	ca: fs.readFileSync(sslServerCa),
};
