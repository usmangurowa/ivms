import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { createTheme } from "@mui/material/styles";

import Link from "../src/Link";
import { Formik } from "formik";

import * as Yup from "yup";
import {
  handleGoogleSignin,
  handleRegister,
  RegisterType,
} from "../src/backend/authentication";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { GlobalState } from "../src/Global";
import locales from "../src/locales";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  fullName: Yup.string().required().label("Full Name"),
  password: Yup.string().required().min(8).label("Password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const theme = createTheme();

const styles = {
  root: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  login: {
    width: { xs: "100%", md: "50%" },
    px: { xs: 2, md: 5 },
    py: { xs: 2, md: 2 },
  },
  image: {
    backgroundImage: "url(/static/images/inmate.jpg)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    width: "50%",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
};

const initialValues: RegisterType = {
  email: "",
  fullName: "",
  password: "",
  confirmPassword: "",
};

export type MessageType = {
  message: string;
  severity: "error" | "warning" | "success";
};

const Register: NextPage = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<MessageType | null>(null);
  const router = useRouter();
  const locale: any = router.locale;
  const handlePop = async () => {
    setLoading(true);
    const response: any = await handleGoogleSignin();
    if (response.ok) {
      setLoading(false);
      setMessage({ message: response.message, severity: "success" });
      setTimeout(() => {
        router.push("/dashboard", {}, { locale });
      }, 2000);
    } else {
      setLoading(false);
      setMessage({ message: response.message, severity: "error" });
    }
  };

  const handleSubmitForm = async (values: RegisterType) => {
    setLoading(true);
    const response: any = await handleRegister(values);
    if (response.ok) {
      setLoading(false);
      setMessage({ message: response.message, severity: "success" });
      setTimeout(() => {
        router.push("/dashboard", {}, { locale });
      }, 2000);
    } else {
      setLoading(false);
      setMessage({ message: response.message, severity: "error" });
    }
  };

  React.useEffect(() => {
    return () => setMessage(null);
  }, []);
  return (
    <>
      <Box sx={styles.root}>
        <Box sx={styles.login}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography color="primary" variant="h3">
                {locales[locale].title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography color="primary" variant="h4">
                {locales[locale].register}
              </Typography>
            </Grid>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmitForm}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <Grid item xs={12}>
                    <TextField
                      onBlur={handleBlur("fullName")}
                      onChange={handleChange("fullName")}
                      error={
                        Boolean(errors["fullName"]) &&
                        Boolean(touched["fullName"])
                      }
                      helperText={errors["fullName"]}
                      fullWidth
                      variant="filled"
                      label={locales[locale].fullName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onBlur={handleBlur("email")}
                      onChange={handleChange("email")}
                      error={
                        Boolean(errors["email"]) && Boolean(touched["email"])
                      }
                      helperText={errors["email"]}
                      fullWidth
                      variant="filled"
                      label={locales[locale].emailAddress}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onBlur={handleBlur("password")}
                      onChange={handleChange("password")}
                      error={
                        Boolean(errors["password"]) &&
                        Boolean(touched["password"])
                      }
                      helperText={errors["password"]}
                      type="password"
                      fullWidth
                      variant="filled"
                      label={locales[locale].password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onBlur={handleBlur("confirmPassword")}
                      onChange={handleChange("confirmPassword")}
                      error={
                        Boolean(errors["confirmPassword"]) &&
                        Boolean(touched["confirmPassword"])
                      }
                      helperText={errors["confirmPassword"]}
                      type="password"
                      fullWidth
                      variant="filled"
                      label={locales[locale].retypePassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LoadingButton
                      onClick={() => handleSubmit()}
                      variant="contained"
                      loading={loading}
                      loadingPosition="end"
                      endIcon={<ExitToAppIcon />}
                      disableElevation
                      sx={{ width: "fit-content", px: 3, py: 2 }}
                    >
                      {locales[locale].register}
                    </LoadingButton>
                  </Grid>
                </>
              )}
            </Formik>
            <Grid item xs={12} container justifyContent="center">
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handlePop}
                component="img"
                src={"/static/images/btn_google_signin.png"}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Link href="/" locale={locale}>
                <Typography color="primary" variant="h5">
                  {locales[locale].login}
                </Typography>
              </Link>
              <Typography sx={{ mx: 5 }} color="primary" variant="h5">
                {locales[locale].or}
              </Typography>
              <Link href="/book" locale={locale}>
                <Typography color="primary" variant="h5">
                  {locales[locale].bookVisit}
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Box sx={styles.image}></Box>
      </Box>
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.severity}>{message?.message}</Alert>
      </Snackbar>
    </>
  );
};

export default Register;
