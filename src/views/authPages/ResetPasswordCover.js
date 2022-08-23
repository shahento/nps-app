// ** React Imports
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import jwt from 'jsonwebtoken';
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin';

// ** Icons Imports
import { ChevronLeft } from 'react-feather';

// ** Custom Components
import InputPassword from '@components/input-password-toggle';

// ** Reactstrap Imports
import {
	Row,
	Col,
	CardTitle,
	CardText,
	FormFeedback,
	Form,
	Label,
	Input,
	Button,
} from 'reactstrap';

// ** Styles
import '@styles/react/pages/page-authentication.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { signIn } from '../../redux/actions';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import {
	ErrorToast,
	SuccessToast,
} from '../../container/components/ToastComponent';
import { toast } from 'react-toastify';
import { ROUTE_SIGN_IN } from '../../router/routes';
import axiosInstance from '../../container/utils/axiosInstance';

const ResetPasswordCover = () => {
	// ** Hooks
	const { skin } = useSkin();
	const history = useHistory();
	const dispatch = useDispatch();
	const { token } = useParams();

	const ResetPasswordSchema = yup.object().shape({
		NewPassword: yup
			.string()
			.required('Please enter new password')
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
			),

		// NewPassword: yup.string().required(),
		ConfirmPassword: yup
			.string()
			.required('please enter confirm password')
			.oneOf(
				[yup.ref(`NewPassword`), null],
				'New password and Confirm password must match.'
			),
	});

	const defaultValues = {
		NewPassword: '',
		ConfirmPassword: '',
	};

	const {
		reset,
		control,
		setError,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'onBlur',
		defaultValues,
		resolver: yupResolver(ResetPasswordSchema),
	});

	useEffect(() => {
		// if (decodeData) {
		// 	console.log('token=======', decodeData);
		// } else {
		// 	console.log('link has been expired please try with new link');
		// }
	}, []);

	const submitForm = (data) => {
		jwt.verify(
			token,
			process.env.REACT_APP_JWT_SECRET,
			(err, decodeData) => {
				if (err) {
					return toast.error(
						<ErrorToast
							message={
								'Link has been expired or broken, Please try again with new link.'
							}
						/>
					);
				} else if (decodeData) {
					let submitData = {
						userId: decodeData.id,
						newPassword: data.NewPassword,
						confirmPassword: data.ConfirmPassword,
					};

					axiosInstance
						.post(
							process.env.REACT_APP_BACKEND_API_URL +
								`api/v1/resetPassword`,
							submitData
						)
						.then((res) => {
							if (res.data.success == 1) {
								toast.success(
									<SuccessToast
										message={res.data.message}
									/>
								);

								history.push(ROUTE_SIGN_IN);
							} else {
								return toast.error(
									<ErrorToast
										message={res.data.message}
									/>
								);
							}
						});
				}
			}
		);

		// axios.post(
		// 	process.env.REACT_APP_BACKEND_API_URL + 'api/v1/loginUser',
		// 	data
		// ).then((response) => {
		// 	if (response.data.success === 1) {
		// 		localStorage.setItem('accessTokenNew', response.data.token);
		// 		toast.success(
		// 			<SuccessToast message={response.data.message} />
		// 		);

		// 		history.push(ROUTE_OVERVIEW);
		// 		// window.location.href = `${ROUTE_DASHBOARD}${ROUTE_OVERVIEW}`;
		// 		// window.location.href = `${ROUTE_OVERVIEW}`;

		// 		// dispatch({
		// 		// 	type: types.SIGN_IN,
		// 		// 	data: response.data.data,
		// 		// });
		// 	} else {
		// 		toast.error(<ErrorToast message={response.data.message} />);
		// 	}
		// });
	};

	const illustration =
			skin === 'dark'
				? 'reset-password-v2-dark.svg'
				: 'reset-password-v2.svg',
		source = require(`@src/assets/images/pages/${illustration}`).default;

	return (
		<div className="auth-wrapper auth-cover">
			<Row className="auth-inner m-0">
				{/* <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <svg viewBox='0 0 139 95' version='1.1' height='28'>
            <defs>
              <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                <stop stopColor='#000000' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
              <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                <stop stopColor='#FFFFFF' offset='100%'></stop>
              </linearGradient>
            </defs>
            <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
              <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                <g id='Group' transform='translate(400.000000, 178.000000)'>
                  <path
                    d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                    id='Path'
                    className='text-primary'
                    style={{ fill: 'currentColor' }}
                  ></path>
                  <path
                    d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                    id='Path'
                    fill='url(#linearGradient-1)'
                    opacity='0.2'
                  ></path>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.049999997'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                  ></polygon>
                  <polygon
                    id='Path-2'
                    fill='#000000'
                    opacity='0.099999994'
                    points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                  ></polygon>
                  <polygon
                    id='Path-3'
                    fill='url(#linearGradient-2)'
                    opacity='0.099999994'
                    points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className='brand-text text-primary ms-1'>Vuexy</h2>
        </Link> */}
				<Col
					className="d-none d-lg-flex align-items-center p-5"
					lg="8"
					sm="12"
				>
					<div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
						<img
							className="img-fluid"
							src={source}
							alt="Login Cover"
						/>
					</div>
				</Col>
				<Col
					className="d-flex align-items-center auth-bg px-2 p-lg-5"
					lg="4"
					sm="12"
				>
					<Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
						<CardTitle tag="h2" className="fw-bold mb-1">
							Reset Password 🔒
						</CardTitle>
						{/* <CardText className="mb-2">
							Your new password must be different from
							previously used passwords
						</CardText> */}
						<Form
							className="auth-reset-password-form mt-2"
							onSubmit={handleSubmit(submitForm)}
						>
							<div className="mb-1">
								<Label
									className="form-label"
									for="NewPassword"
								>
									New Password
								</Label>

								<Controller
									control={control}
									id="NewPassword"
									name="NewPassword"
									render={({ field }) => (
										<InputPassword
											placeholder=""
											invalid={
												errors.NewPassword &&
												true
											}
											{...field}
										/>
									)}
								/>
								{errors && errors.NewPassword && (
									<FormFeedback>
										{errors.NewPassword.message}
									</FormFeedback>
								)}
							</div>
							<div className="mb-1">
								<Label
									className="form-label"
									for="ConfirmPassword"
								>
									Confirm Password
								</Label>

								<Controller
									control={control}
									id="ConfirmPassword"
									name="ConfirmPassword"
									render={({ field }) => (
										<InputPassword
											placeholder=""
											invalid={
												errors.ConfirmPassword &&
												true
											}
											{...field}
										/>
									)}
								/>
								{errors && errors.ConfirmPassword && (
									<FormFeedback>
										{
											errors.ConfirmPassword
												.message
										}
									</FormFeedback>
								)}
								{/* <InputPassword
									className="input-group-merge"
									id="confirm-password"
								/> */}
							</div>
							<Button color="primary" block>
								Set New Password
							</Button>
						</Form>
						<p className="text-center mt-2">
							<Link to={ROUTE_SIGN_IN}>
								<ChevronLeft
									className="rotate-rtl me-25"
									size={14}
								/>
								<span className="align-middle">
									Back to login
								</span>
							</Link>
						</p>
					</Col>
				</Col>
			</Row>
		</div>
	);
};

export default ResetPasswordCover;
