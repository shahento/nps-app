import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card } from 'reactstrap';
import { connect } from 'react-redux';
import cx from 'classnames';
import _get from 'lodash/get';

// import * as Actions from '../../container/redux/actions';
import FormComponent from '../../container/components/FormValidationHelper';
import Meta from '../../container/utils/meta';
import Breadcrumbs from '../../container/components/Breadcrumb';
import ImageUpload from '../../container/components/ImageUpload';
import {
	EMPTY_STRING,
	EMPTY_OBJECT,
	UNDEFINED,
} from '../../container/constants/commonConstants';
import { handleValidationForUserDetails } from './Validation';
import { Container } from './Styled';

import Loading from '../../container/assets/loading.gif';
import axiosInstance from '../../container/utils/axiosInstance';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
	ErrorToast,
	SuccessToast,
} from '../../container/components/ToastComponent';

import * as types from '../../redux/constants/actionTypes';

import { useDispatch } from 'react-redux';
import Tabs from './Tabs';
import config from '../../container/utils/axiosConfig';

const Profile = () => {
	const user = useSelector((state) => state.user.currentUser);
	const dispatch = useDispatch();

	const [state, setState] = useState({
		loading: false,
		profileImage: EMPTY_STRING,
		photo: EMPTY_STRING,
		brandImage: EMPTY_STRING,
		brandPhoto: EMPTY_STRING,
		firstName: EMPTY_STRING,
		lastName: EMPTY_STRING,
		username: EMPTY_STRING,
		email: EMPTY_STRING,
		mobileNo: EMPTY_STRING,
		form: {
			errors: EMPTY_OBJECT,
		},
	});

	useEffect(async () => {
		console.log('user', user);

		setState({
			...state,
			profileImage: user.profile_pic,
			brandImage: user.brand_logo,
			firstName: user.first_name,
			lastName: user.last_name,
			username: user.username,
			email: user.email,
			mobileNo: String(user.mobile_no),
		});

		// let id = 49;
		// let currentUser = '';
		// axiosInstance.get(`profile?user_id=${id}`).then((res) => {
		// 	console.log('res data profile', res.data);
		// 	if (res.data?.data) {
		// 		currentUser = res.data.data;
		// 		setState({
		// 			...state,
		// 			profileImage: currentUser.profile_pic_url,
		// 			brandImage: currentUser.brand_logo_url,
		// 			firstName: currentUser.first_name,
		// 			lastName: currentUser.last_name,
		// 			username: currentUser.username,
		// 			email: currentUser.email,
		// 			mobileNo: String(currentUser.mobile_no),
		// 		});
		// 	}
		// });
	}, [user]);

	const onDropProfile = (photo, imageUrl) => {
		console.log(imageUrl.name);
		setState({ ...state, photo, profileImage: imageUrl });
	};

	const onDropBrandLogo = (photo, imageUrl) => {
		setState({ ...state, brandPhoto: photo, brandImage: imageUrl });
	};

	const onChangePhoneNumber = (e) => {
		const value = e.target.value;
		const numbers = /^[0-9]+$/;
		if ((!value || value.match(numbers)) && value.length <= 10) {
			setState({ ...state, mobileNo: value });
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setState({
			...state,
			[name]: value,
		});
	};

	const save = () => {
		// const { saveUserProfile } = props;
		const {
			profileImage,
			brandImage,
			form,
			firstName,
			lastName,
			username,
			email,
			mobileNo,
		} = state;
		const validation = handleValidationForUserDetails(state);
		if (!validation.formIsValid) {
			form.errors = validation.errors;
			setState({ ...state, form });
			return;
		}
		const newData = new FormData();
		newData.append(
			'profile_pic',
			typeof profileImage === 'object' ? profileImage : profileImage
		);
		newData.append(
			'brand_logo',
			typeof brandImage === 'object' ? brandImage : brandImage
		);
		newData.append('first_name', firstName);
		newData.append('last_name', lastName);
		newData.append('username', username);
		newData.append('email', email);
		newData.append('userId', user && user.id);

		setState({
			...state,
			loading: true,
		});

		console.log('save profile', newData);

		setState({
			...state,
			loading: false,
		});

		axiosInstance
			.post(
				process.env.REACT_APP_BACKEND_API_URL + 'api/v1/updateUser',
				newData
			)
			.then((res) => {
				if (res.data.success === 1) {
					toast.success(
						<SuccessToast message={res.data.message} />
					);

					dispatch({
						type: types.CURRENT_USER,
						data: res.data.data,
					});
				} else {
					toast.error(<ErrorToast message={res.data.message} />);
				}
			});

		// saveUserProfile(newData).then(() => {
		// 	this.setState({
		// 		loading: false,
		// 	});
		// });
	};

	const {
		loading,
		profileImage,
		photo,
		brandImage,
		brandPhoto,
		firstName,
		lastName,
		username,
		email,
		mobileNo,
		form: { errors },
	} = state;
	return (
		<Container className="container">
			{/* <Breadcrumbs data={['Home', 'Profile']} /> */}
			{/* <Tabs /> */}
			<Card body>
				<div className="title">User Profile</div>
				<Row className="image-row row">
					<ImageUpload
						photo={photo}
						imageUrl={
							process.env.REACT_APP_BACKEND_API_URL +
							`${state.profileImage}`
						}
						save={onDropProfile}
					/>
				</Row>
				<div className="row-wrapper">
					<Row className="brand-logo">
						<ImageUpload
							photo={brandPhoto}
							imageUrl={
								process.env.REACT_APP_BACKEND_API_URL +
								`${state.brandImage}`
							}
							save={onDropBrandLogo}
						/>
						<div
							style={{ width: 'auto' }}
							className="brand-title"
						>
							Brand Logo
						</div>
					</Row>
					<Row>
						<Col>
							<input
								type="text"
								name="firstName"
								placeholder="First name"
								className={cx(
									errors.firstName && 'error'
								)}
								value={firstName}
								onChange={handleInputChange}
								errors={errors.firstName}
							/>
						</Col>
						<Col>
							<input
								type="text"
								name="lastName"
								placeholder="Last name"
								className={cx(
									errors.lastName && 'error'
								)}
								value={lastName}
								onChange={handleInputChange}
								errors={errors.lastName}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<input
								type="text"
								name="username"
								placeholder="Username"
								className={cx(
									errors.username && 'error'
								)}
								value={username}
								onChange={handleInputChange}
								errors={errors.username}
							/>
						</Col>
						<Col>
							<input
								type="email"
								name="email"
								placeholder="Email"
								className={cx(errors.email && 'error')}
								value={email}
								onChange={handleInputChange}
								errors={errors.email}
							/>
						</Col>
					</Row>
					<Row>
						<Col className="col-6">
							<input
								type="text"
								name="mobileNo"
								placeholder="Mobile number"
								className={cx(
									errors.mobileNo && 'error'
								)}
								value={mobileNo}
								onChange={onChangePhoneNumber}
								errors={errors.mobileNo}
							/>
						</Col>
					</Row>
					<div className="button">
						<Button
							color="primary"
							className="save-button"
							onClick={() => !loading && save()}
						>
							{loading ? (
								<img
									src={Loading}
									style={{
										width: '15%',
										height: '100%',
									}}
									className="loading"
								/>
							) : (
								'Save'
							)}
						</Button>
					</div>
				</div>
			</Card>
		</Container>
	);
};

export default Profile;
