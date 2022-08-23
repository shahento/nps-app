// ** React Imports
import { Suspense, lazy, Fragment, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// ** Utils
import { useLayout } from '@hooks/useLayout';
import { useRouterTransition } from '@hooks/useRouterTransition';

// ** Custom Components
import LayoutWrapper from '@layouts/components/layout-wrapper';

// ** Router Components
import {
	BrowserRouter as AppRouter,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// ** Routes & Default Routes
import { DefaultRoute, Routes, publicRoutes } from './routes/index';

// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
import HorizontalLayout from '@src/layouts/HorizontalLayout';
import LoginCover from '../views/Login';
import { getUserProfile } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../redux/constants/actionTypes';
import config from '../container/utils/axiosConfig';
import axiosInstance from '../container/utils/axiosInstance';
import RegisterCover from '../views/Register';
// import Cookies from 'js-cookie';
// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const Router = () => {
	// ** Hooks

	const dispatch = useDispatch();
	const userData = useSelector((state) => state.currentUser);
	const { layout, setLayout, setLastLayout } = useLayout();
	const { transition, setTransition } = useRouterTransition();

	// ** Default Layout
	const DefaultLayout =
		layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout';

	// ** All of the available layouts
	const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

	// ** Current Active Item
	const currentActiveItem = null;

	// ** Return Filtered Array of Routes & Paths
	const LayoutRoutesAndPaths = (layout) => {
		const LayoutRoutes = [];
		const LayoutPaths = [];

		if (Routes) {
			Routes.filter((route) => {
				// ** Checks if Route layout or Default layout matches current layout
				if (
					route.layout === layout ||
					(route.layout === undefined &&
						DefaultLayout === layout)
				) {
					LayoutRoutes.push(route);
					LayoutPaths.push(route.path);
				}
			});
		}

		return { LayoutRoutes, LayoutPaths };
	};

	const NotAuthorized = lazy(() => import('../views/NotAuthorized'));

	// ** Init Error Component
	const Error = lazy(() => import('../views/Error'));

	// useEffect(async () => {
	// 	console.log('use effect ---');
	// 	await getUserProfile({ userId: 1 });
	// }, []);

	const isUserLoggedIn = () => {
		let loginFlag = false;
		let token = localStorage.getItem('accessTokenNew');
		if (token) {
			jwt.verify(token, 'secret_key', (err, data) => {
				if (data) {
					if (!userData || userData == null) {
						axiosInstance
							.post(
								process.env.REACT_APP_BACKEND_API_URL +
									'api/v1/getUserProfile',
								data
							)
							.then((response) => {
								if (response.data.success === 1) {
									console.log(
										'response',
										response.data.data
									);
									dispatch({
										type: types.CURRENT_USER,
										data: response.data.data,
									});
								} else {
									// alert('error');
									// Toast({
									// 	message: response.data.error_code,
									// 	type: 'error',
									// });
								}
							});
					}
					loginFlag = true;
				}
				if (err) {
					loginFlag = false;
				}
			});

			return loginFlag;
		}

		return loginFlag;
	};

	/**
	 ** Final Route Component Checks for Login & User Role and then redirects to the route
	 */
	const FinalRoute = (props) => {
		const route = props.route;
		let action, resource;

		// ** Assign vars based on route meta
		if (route.meta) {
			action = route.meta.action ? route.meta.action : null;
			resource = route.meta.resource ? route.meta.resource : null;
		}

		if (
			(!isUserLoggedIn() && route.meta === undefined) ||
			(!isUserLoggedIn() &&
				route.meta &&
				!route.meta.authRoute &&
				!route.meta.publicRoute)
		) {
			/**
			 ** If user is not Logged in & route meta is undefined
			 ** OR
			 ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
			 ** Then redirect user to login
			 */

			return <Redirect to="/login" />;
		} else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
			// ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
			return <Redirect to="/" />;
			// } else if (
			// 	isUserLoggedIn() &&
			// 	!ability.can(action || 'read', resource)
			// ) {
			// 	// ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
			// 	return <Redirect to="/misc/not-authorized" />;
		} else {
			// ** If none of the above render component
			// localStorage.removeItem('accessTokenNew');
			// return <Redirect to="/misc/not-authorized" />;
			return <route.component {...props} />;
		}
	};

	// ** Return Route to Render
	const ResolveRoutes = () => {
		return Object.keys(Layouts).map((layout, index) => {
			// ** Convert Layout parameter to Layout Component
			// ? Note: make sure to keep layout and component name equal

			const LayoutTag = Layouts[layout];

			// ** Get Routes and Paths of the Layout
			const { LayoutRoutes, LayoutPaths } =
				LayoutRoutesAndPaths(layout);

			// ** We have freedom to display different layout for different route
			// ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
			// ** that we want to implement like VerticalLayout or HorizontalLayout
			// ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

			// ** RouterProps to pass them to Layouts
			const routerProps = {};

			return (
				<Route path={LayoutPaths} key={index}>
					<LayoutTag
						layout={layout}
						setLayout={setLayout}
						transition={transition}
						routerProps={routerProps}
						setLastLayout={setLastLayout}
						setTransition={setTransition}
						currentActiveItem={currentActiveItem}
					>
						<Switch>
							{LayoutRoutes.map((route) => {
								let name = '';
								route.isPublicRoute &&
								route.isPublicRoute
									? (name = 'Route')
									: (name = 'PrivateRoute');

								return (
									<Route
										key={route.path}
										path={route.path}
										exact={route.exact === true}
										render={(props) => {
											// ** Assign props to routerProps
											Object.assign(
												routerProps,
												{
													...props,
													meta: route.meta,
												}
											);

											//

											return (
												<Fragment>
													{/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

													{route.layout ===
													'BlankLayout' ? (
														<Fragment>
															<FinalRoute
																route={
																	route
																}
																{...props}
															/>
															{/* <route.component
																{...props}
															/> */}
														</Fragment>
													) : (
														<LayoutWrapper
															layout={
																DefaultLayout
															}
															transition={
																transition
															}
															setTransition={
																setTransition
															}
															/* Conditional props */
															/*eslint-disable */
															{...(route.appLayout
																? {
																		appLayout:
																			route.appLayout,
																  }
																: {})}
															{...(route.meta
																? {
																		routeMeta:
																			route.meta,
																  }
																: {})}
															{...(route.className
																? {
																		wrapperClass:
																			route.className,
																  }
																: {})}
															/*eslint-enable */
														>
															<Suspense
																fallback={
																	null
																}
															>
																<FinalRoute
																	route={
																		route
																	}
																	{...props}
																/>
																{/* <route.component
																	{...props}
																/> */}
															</Suspense>
														</LayoutWrapper>
													)}
												</Fragment>
											);
										}}
									/>
								);
							})}
						</Switch>
					</LayoutTag>
				</Route>
			);
		});
	};

	return (
		<AppRouter basename={process.env.REACT_APP_BASENAME}>
			<Switch>
				{/* If user is logged in Redirect user to DefaultRoute else to login */}
				<Route
					exact
					path="/"
					render={() => {
						return <Redirect to={DefaultRoute} />;
					}}
				/>
				<Route
					exact
					path="/login"
					render={() =>
						isUserLoggedIn() ? (
							<>
								<Redirect to={DefaultRoute} />
							</>
						) : (
							<Layouts.BlankLayout>
								<LoginCover />
							</Layouts.BlankLayout>
						)
					}
				/>
				{/* Not Auth Route */}
				<Route
					exact
					path="/not-authorized"
					render={() => (
						<Layouts.BlankLayout>
							<NotAuthorized />
						</Layouts.BlankLayout>
					)}
				/>
				<Route
					exact
					path="/register"
					render={() => (
						<Layouts.BlankLayout>
							<RegisterCover />
						</Layouts.BlankLayout>
					)}
				/>
				{ResolveRoutes()}

				{/* NotFound Error page */}
				<Route path="*" component={Error} />
			</Switch>
		</AppRouter>
	);
};

export default Router;
