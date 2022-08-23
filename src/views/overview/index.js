import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import Breadcrumbs from '../../container/components/Breadcrumb';
// import Loading from '../../container/components/Loading';
import Loading from '../../../src/@core/components/spinner/Fallback-spinner';
import Meta from '../../container/utils/meta';
import { getRandomColors } from '../../container/utils/randomColors';
import axiosInstance from '../../container/utils/axiosInstance';
import {
	EMPTY_STRING,
	EMPTY_ARRAY,
	NULL,
} from '../../container/constants/commonConstants';
import { Container, Box } from './Styled';
import { Link } from 'react-router-dom';
import Check from '../../container/assets/check.svg';
import Uncheck from '../../container/assets/uncheck.svg';
import _map from 'lodash/map';
import _get from 'lodash/get';
import AddIconToLibrary from '../../container/utils/fontAwesomeIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUserFriends,
	faChartBar,
	faEllipsisV,
	faCircle,
	faEyes,
} from '@fortawesome/free-solid-svg-icons';
AddIconToLibrary([faUserFriends, faChartBar, faEllipsisV, faCircle]);
import { Responsive, WidthProvider } from 'react-grid-layout';
import moment from 'moment';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import PieChart from './PieChart.jsx';
import { Pagination } from 'antd';
// import { Skeleton, List, Avatar } from 'antd';
import 'antd/dist/antd.css';
import Skeleton from '@mui/material/Skeleton';

// import Skeleton from 'react-loading-skeleton';
// import 'react-loading-skeleton/dist/skeleton.css';

import { withSize } from 'react-sizeme';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import WordCloud from './WordCloud';
const ResponsiveGridLayout = WidthProvider(Responsive);
import LineChart from './LineChart.jsx';
import Flatpickr from 'react-flatpickr';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import * as Actions from '../../redux/actions';
import { Eye } from 'react-feather';

const layoutFresh = {
	lg: [
		{
			w: 3,
			h: 1,
			x: 0,
			y: 0,
			minW: 2,
			i: '1',
			moved: false,
			static: false,
		},
		{
			w: 3,
			h: 1,
			x: 3,
			minW: 2,
			y: 0,
			i: '2',
			moved: false,
			static: false,
		},
		{
			w: 3,
			h: 2,
			x: 0,
			y: 1,
			i: '3',
			minW: 2,
			minH: 2,
			moved: false,
			static: false,
		},
		{
			w: 3,
			h: 2,
			x: 3,
			y: 1,
			i: '4',
			minW: 2,
			minH: 2,
			moved: false,
			static: false,
		},
		{
			w: 6,
			h: 2.4,
			x: 6,
			y: 0,
			i: '5',
			minW: 4,
			minH: 2.4,
			moved: false,
			static: false,
		},
		{
			w: 6,
			h: 2,
			x: 0,
			y: 3,
			i: '6',
			minW: 4,
			minH: 2,
			moved: false,
			static: false,
		},
		{
			w: 6,
			h: 2.5,
			x: 6,
			y: 2.4,
			i: '7',
			minW: 2,
			minH: 2.5,
			moved: false,
			static: false,
		},
	],
	md: [
		{
			w: 1,
			h: 1,
			x: 0,
			y: 0,
			i: '1',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 1,
			y: 0,
			i: '2',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 2,
			y: 0,
			i: '3',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 3,
			y: 0,
			i: '4',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 4,
			y: 0,
			i: '5',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 0,
			y: 1,
			i: '6',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 0,
			y: 2,
			i: '7',
			moved: false,
			static: false,
		},
	],
	sm: [
		{
			w: 3,
			h: 1,
			x: 0,
			y: 0,
			i: '1',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 1,
			y: 1,
			i: '2',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 2,
			y: 1,
			i: '3',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 3,
			y: 0,
			i: '4',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 4,
			y: 0,
			i: '5',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 0,
			y: 1,
			i: '6',
			moved: false,
			static: false,
		},
		{
			w: 1,
			h: 1,
			x: 0,
			y: 2,
			i: '7',
			moved: false,
			static: false,
		},
	],
};
const getLayouts = () => {
	const savedLayouts = localStorage.getItem('grid-layout');
	const savedLayoutsFromDb = localStorage.getItem('savedGridLayout');

	// if (JSON.parse(savedLayoutsFromDb) == null) {
	// 	return layoutFresh;
	// } else {
	// 	return JSON.parse(savedLayoutsFromDb);
	// }

	return { lg: layoutFresh.lg };
};

export const Home = (props) => {
	// const [dashboardDetails, setDashboardDetails] = useState({});

	const dataDash = useSelector((state) => state.user.dashboardDetails);
	const history = useHistory();
	const [state, setState] = useState({
		loading: false,
		filter: 'daily',
		startDate: '',
		endDate: '',
		lineChartDetails: NULL,
		userList: EMPTY_ARRAY,
		paginatedData: [],
		selectedUser: '',
		allKeyword: [],
		topKeywords: [],
		currentPage: 1,
		pageSize: 4,
		dashboardDetails: {},
		contentLoader: false,
		picker: new Date(),
	});

	//window width find ---
	// const [screenSize, getDimension] = useState({
	// 	dynamicWidth: window.innerWidth,
	// 	dynamicHeight: window.innerHeight,
	// });
	// const setDimension = () => {
	// 	getDimension({
	// 		dynamicWidth: window.innerWidth,
	// 		dynamicHeight: window.innerHeight,
	// 	});
	// };

	// // console.log('size ----', screenSize.dynamicWidth);
	// useEffect(() => {
	// 	window.addEventListener('resize', setDimension);

	// 	return () => {
	// 		window.removeEventListener('resize', setDimension);
	// 	};
	// }, [screenSize]);

	useEffect(async () => {
		const { getDashboardDetails, dashboardDetails } = props;
		setState({
			...state,
			// loading: true,
			contentLoader: true,
		});
		let data = {
			// user_id: 49,
			start_date: state.startDate,
			end_date: state.endDate,
		};

		const colors = ['#bce897', '#faca00', '#e95432', '#779ce6'];

		await getDashboardDetails(data, history).then(() => {
			console.log('redux action');

			setState({
				...state,
				// loading: false,
				contentLoader: false,
				// dashboardDetails: dashboardDetails,
			});
		});
	}, [state.startDate, state.endDate]);

	useEffect(() => {
		let userList12 =
			dataDash &&
			dataDash.recent_respondent_comments.map((list) => {
				return {
					...list,
					color: getRandomColors(),
				};
			});

		let lineChartDetails12 = dataDash && dataDash.survey_responses;

		dataDash &&
			setState({
				...state,
				allKeyword: dataDash && dataDash.all_keywords,
				topKeywords: dataDash && dataDash.top_keywords,
				userList: userList12,
				paginatedData: userList12.slice(0, 4),
				lineChartDetails: lineChartDetails12,
				dashboardDetails: dataDash,
				loading: false,
				contentLoader: false,
			});
	}, [dataDash]);

	const handlePagination = (page) => {
		const upperLimit = page * state.pageSize;
		const dataSlice = state.userList.slice(
			upperLimit - state.pageSize,
			upperLimit
		);

		setState({
			...state,
			paginatedData: dataSlice,
			currentPage: page,
		});
	};

	const handleCommentClick = (list) => {
		if (state.selectedUser === list.id) {
			setState({
				...state,
				selectedUser: '',
			});
		} else {
			setState({
				...state,
				selectedUser: list.id,
			});
		}
	};

	const handleDateChange = (e) => {
		if (e != null) {
			setState({
				...state,
				startDate: e[0] && moment(e[0]).format('YYYY-MM-DD'), // moment(e[0]).format('YYYY-MM-DD'),
				endDate: e[1] && moment(e[1]).format('YYYY-MM-DD'), // moment(e[1]).format('YYYY-MM-DD'),
			});
		}
	};

	const handleClean = (e) => {
		setState({
			...state,
			startDate: '',
			endDate: '',
		});
	};

	const handleLayoutChange = (layout, layouts) => {
		localStorage.setItem('grid-layout', JSON.stringify(layouts));
	};

	return (
		<>
			{state.loading ? (
				<Loading />
			) : (
				<Container className="container">
					<Meta title="Overview" description="" />
					<div style={{ marginBottom: '30px' }}>
						<Breadcrumbs data={['Dashboard', 'Overview']} />
					</div>
					<div>
						{' '}
						<DateRangePicker
							showOneCalendar
							onClean={handleClean}
							disabledDate={DateRangePicker.after(
								new Date()
							)}
							onChange={handleDateChange}
							placement="bottom"
							appearance="default"
							placeholder="Select Date Range"
							size="lg"
							style={{
								justifyContent: 'center',
								marginLeft: '17px',
								width: 220,
								align: 'center',
								// border: '0.1px solid black',
								borderRadius: '5px',
								float: 'right',
								marginRight: '20px',
							}}
						/>
					</div>

					<div className="title">Overview</div>
					<ResponsiveGridLayout
						isDraggable
						isRearrangeable
						isResizable
						draggableHandle=".respondents-comments-title,.promoters-title,.number"
						breakpoints={{
							lg: 1280,
							md: 992,
							sm: 767,
							xs: 480,
							xxs: 0,
						}}
						cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
						className="layout"
						// layout={staticLayout}
						layouts={getLayouts()}
						// layouts={{ lg: staticLayout }}
						onLayoutChange={handleLayoutChange}
					>
						<div
							className="card score"
							key="1"
							// data-grid={{ x: 0, y: 0, w: 3, h: 1 }}
						>
							{state.contentLoader ? (
								<>
									<Skeleton
										animation="wave"
										style={{ width: '70%' }}
									/>
									<Skeleton
										animation="wave"
										style={{ width: '80%' }}
									/>
								</>
							) : (
								<>
									<div className="number">
										{_get(
											state.dashboardDetails,
											'net_promoter_score',
											NULL
										)}
									</div>
									<div className="number-text">
										Net Promoter Score
									</div>
									<div className="overlay1">
										<FontAwesomeIcon
											icon={[
												'fas',
												'chart-bar',
											]}
										/>
									</div>
								</>
							)}
						</div>

						<div
							className="card respondents"
							key="2"
							// data-grid={{ x: 3, y: 0, w: 3, h: 1 }}
						>
							{state.contentLoader ? (
								<>
									<Skeleton
										animation="wave"
										style={{ width: '70%' }}
									/>
									<Skeleton
										animation="wave"
										style={{ width: '80%' }}
									/>
								</>
							) : (
								<>
									<div className="number">
										{_get(
											state.dashboardDetails,
											'number_of_respondents',
											NULL
										)}
									</div>

									<div className="number-text1">
										Number of Respondents
									</div>
									<div className="overlay2">
										<FontAwesomeIcon
											className="fa-user-friends"
											icon={[
												'fas',
												'user-friends',
											]}
										/>
									</div>
								</>
							)}
						</div>
						<div
							className="card promoters"
							key="3"
							// data-grid={{
							// 	x: 0,
							// 	y: 0,
							// 	w: 3,
							// 	h: 2,
							// 	minW: 2,
							// 	minH: 2,
							// }}
						>
							<div className="promoters-title">
								<div>Promoters vs. Detractors</div>
								{/* <FontAwesomeIcon icon={['fas', 'ellipsis-v']} /> */}
							</div>

							{state.contentLoader ? (
								<>
									<Skeleton
										style={{
											margin: 'auto auto',
										}}
										variant="circular"
										width={150}
										height={150}
									/>
								</>
							) : (
								<>
									<div className="pie-wrapper">
										<div className="pie">
											{' '}
											{state.dashboardDetails && (
												<PieChart
													data={_get(
														state.dashboardDetails,
														'pie_chart',
														NULL
													)}
												/>
											)}
										</div>
									</div>
									<Row className="label">
										<Col className="col-6 color1">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Promoters</div>
										</Col>
										<Col className="col-6 color2">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Passive</div>
										</Col>
										<Col className="col-6 color3">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Detractors</div>
										</Col>
									</Row>
								</>
							)}
						</div>
						<div
							className="card uses-totals"
							key="4"
							// data-grid={{
							// 	x: 3,
							// 	y: 0,
							// 	w: 3,
							// 	h: 2,
							// 	minW: 2,
							// 	minH: 2,
							// }}
						>
							<div className="promoters-title">
								<div>User Totals</div>
								{/* <FontAwesomeIcon icon={['fas', 'ellipsis-v']} /> */}
							</div>

							{state.contentLoader ? (
								<>
									<Skeleton
										style={{
											margin: 'auto auto',
										}}
										variant="circular"
										width={150}
										height={150}
									/>
								</>
							) : (
								<>
									<div className="uses-totals-pop">
										<div className="user-sm">
											<div className="promoters-k">
												<div>
													{_get(
														state.dashboardDetails,
														'user_totals.promoters',
														NULL
													)}
												</div>
												{/* <div>Promoters</div> */}
											</div>
											<div className="passive-k">
												<div>
													{_get(
														state.dashboardDetails,
														'user_totals.passive',
														NULL
													)}
												</div>
												{/* <div>Passive</div> */}
											</div>
											<div className="detractors-k">
												<div>
													{_get(
														state.dashboardDetails,
														'user_totals.detractors',
														NULL
													)}
												</div>
											</div>
										</div>
									</div>
									<Row className="label1">
										<Col className="col-6 color1">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Promoters</div>
										</Col>
										<Col className="col-6 color2">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Passive</div>
										</Col>
										<Col className="col-6 color3">
											<FontAwesomeIcon
												icon={[
													'fas',
													'circle',
												]}
											/>
											<div>Detractors</div>
										</Col>
									</Row>
								</>
							)}
						</div>

						<div
							// className="respondents-comments-flex"
							key="5"
							// data-grid={{
							// 	x: 6,
							// 	y: 0,
							// 	w: 6,
							// 	h: 2.4,
							// 	minH: 2.4,
							// 	minW: 2,
							// }}
						>
							<div className="card">
								{/* respondents-comments */}
								<div className="respondents-comments-title">
									Latest Comments
								</div>
								<div className="wrapper">
									{state.contentLoader ? (
										<>
											<Skeleton
												variant="text"
												style={{
													width: '90%',
													margin: 'auto auto',
													height: '60px',
												}}
											/>
											<Skeleton
												variant="text"
												style={{
													width: '90%',
													margin: 'auto auto',
													height: '60px',
												}}
											/>
											<Skeleton
												variant="text"
												style={{
													width: '90%',
													margin: 'auto auto',
													height: '60px',
												}}
											/>
											<Skeleton
												variant="text"
												style={{
													width: '90%',
													margin: 'auto auto',
													height: '60px',
												}}
											/>
										</>
									) : (
										<>
											{_map(
												state.paginatedData,
												(list, index) => (
													<div
														className={
															state.selectedUser ===
															list.id
																? 'wrap-flex active'
																: 'wrap-flex'
														}
														key={
															index
														}
														onClick={() =>
															handleCommentClick(
																list
															)
														}
													>
														{state.selectedUser ===
														list.id ? (
															<img
																src={
																	Check
																}
																className="check-box"
															/>
														) : (
															<img
																src={
																	Uncheck
																}
																className="check-box"
															/>
														)}
														<div className="profile-flex">
															<Box
																color={
																	list.color
																}
																className="user-profile"
															>
																{
																	list.image
																}
															</Box>
															<div>
																<div className="name">
																	{
																		list.name
																	}
																</div>
																<div className="profile-type">
																	{
																		list.message
																	}
																</div>
															</div>
														</div>{' '}
														{state.selectedUser ===
														list.id ? (
															<div>
																<div
																	outline
																	color="primary"
																	size="small"
																	style={{
																		marginLeft:
																			'25px',
																		height: 'auto',
																		width: 'auto',
																	}}
																	onClick={() => {
																		let url = `/feedback?comment_id=${list.id}`;
																		history.push(
																			url
																		);
																	}}
																>
																	<Eye
																		size={
																			20
																		}
																		style={{
																			marginRight:
																				'5px',
																		}}
																	/>
																	View
																	Comment
																</div>
															</div>
														) : (
															<></>
														)}
													</div>
												)
											)}

											{state.paginatedData &&
											state.paginatedData
												.length > 0 ? (
												<div
													style={{
														textAlign:
															'center',
														background:
															'white',
														position:
															'fixed',
														height: '10%',
														width: '100%',
														bottom: '0px',
													}}
												>
													{' '}
													<Pagination
														responsive
														pageSize={
															state.pageSize
														}
														style={{
															width: '100%',
														}}
														showSizeChanger={
															false
														}
														onChange={
															handlePagination
														}
														current={
															state.currentPage
														}
														total={
															state
																.userList
																.length
														}
													/>
												</div>
											) : (
												<>
													{/* <img
                              src={NoDataImage}
                              style={{ boxSizing: 'cover' }}
                              alt="loading"
                            /> */}
												</>
											)}
										</>
									)}
								</div>
							</div>
						</div>

						<div
							className="card survey"
							key="6"

							// data-grid={{
							// 	x: 0,
							// 	y: 6,
							// 	w: 6,
							// 	h: 2,
							// 	minW: 2,
							// 	minH: 2,
							// }}
						>
							<div className="promoters-title">
								<div>Survey Responses</div>
								<div className="flex">
									<div className="filter"></div>
								</div>
							</div>
							{state.dashboardDetails &&
								(state.contentLoader ? (
									<>
										<Skeleton
											variant="rectangular"
											width="100%"
											height="100%"
										/>
									</>
								) : (
									<>
										<LineChart
											data={
												state.lineChartDetails &&
												state.lineChartDetails
											}
										/>
										{/* 
										<div className="active-label">
											<div>
												<FontAwesomeIcon
													icon={[
														'fas',
														'circle',
													]}
												/>
												Active
											</div>
										</div> */}
									</>
								))}
						</div>

						<div
							className="card keywords"
							key="7"
							// data-grid={{
							// 	x: 6,
							// 	y: 6,
							// 	w: 6,
							// 	h: 2.5,
							// 	minW: 2,
							// 	minH: 2.5,
							// }}
						>
							<div className="promoters-title">
								<div>
									Top Keywords Mentioned in Comments
								</div>
							</div>

							{state.contentLoader ? (
								<>
									<Skeleton
										variant="rectangular"
										width="100%"
										height="100%"
									/>
								</>
							) : (
								// <CircleCloud />

								<WordCloud
									// keywords={_get(
									// 	state.dashboardDetails,
									// 	'top_keywords',
									// 	NULL
									// )}
									allKeywords={
										state.allKeyword &&
										state.allKeyword
									}
									topKeywords={
										state.topKeywords &&
										state.topKeywords
									}
									startDate={state.startDate}
									endDate={state.endDate}
								/>
							)}
						</div>
					</ResponsiveGridLayout>
				</Container>
			)}
		</>
	);
};

// export default Home;

const mapStateToProps = (state) => ({
	dashboardDetails: state.user.dashboardDetails,
});

export default connect(mapStateToProps, {
	getDashboardDetails: Actions.getDashboardDetails,
	getLineChartDetails: Actions.getLineChartDetails,
})(Home);
