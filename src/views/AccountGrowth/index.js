import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import readXlsxFile from 'read-excel-file';
import UsaMap from './UsaMap';
import { Card, Col } from 'reactstrap';
import LineChart from './LineChart';
const AccountGrowth = () => {
	const [fileUploaded, setFileUploaded] = useState('');

	console.log(fileUploaded);

	const handleUpload = (e) => {
		e.preventDefault();
		if (e.target.files) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = e.target.result;
				const workbook = XLSX.read(data, { type: 'array' });
				const sheetName = workbook.SheetNames[7];
				const worksheet = workbook.Sheets[sheetName];
				const json = XLSX.utils.sheet_to_json(worksheet);
				console.log('file data ======', workbook);

				console.log('file data', json);
			};
			reader.readAsArrayBuffer(e.target.files[0]);
		}
	};

	return (
		<div>
			<Col md="12">
				<Card body>
					<LineChart />
				</Card>
			</Col>
			<UsaMap />
		</div>
	);
};

export default AccountGrowth;
