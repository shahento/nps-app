import Chart from 'react-apexcharts';

import React from 'react';

const LineChart = () => {
	const series = [
		{
			name: 'Year - 2022',
			data: [28, 29, 33, 36, 32, 32, 33],
		},
		{
			name: 'Year - 2021',
			data: [12, 11, 14, 18, 17, 13, 13],
		},
		{
			name: 'Year - 2020',
			data: [12, 11, 14, 50, 17, 13, 13],
		},
	];
	const options = {
		chart: {
			height: 350,
			type: 'line',
			dropShadow: {
				enabled: true,
				color: '#000',
				top: 18,
				left: 7,
				blur: 10,
				opacity: 0.2,
			},
			toolbar: {
				show: false,
			},
		},
		colors: ['#77B6EA', '#545454', '#545896'],
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: 'smooth',
		},
		title: {
			// position: 'bottom',
			show: false,
			text: '',
			align: 'left',
		},
		grid: {
			// show: false,
			// borderColor: '#e7e7e7',
			// row: {
			// 	colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
			// 	opacity: 0.5,
			// },
		},
		markers: {
			size: 1,
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
			title: {
				text: 'Month',
			},
		},
		yaxis: {
			title: {
				text: 'Accounts',
			},
			// min: 5,
			// max: 40,
		},
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			floating: false,
			// offsetY: -25,
			// offsetX: -5,
		},
	};

	return (
		<Chart
			options={options}
			series={series}
			type="line"
			// width={500}
			height={320}
		/>
	);
};

export default LineChart;
