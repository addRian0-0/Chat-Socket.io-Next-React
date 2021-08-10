import Head from "next/head";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from "react";
import * as yup from "yup";
import swal from "sweetalert";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const socket = io(`http://localhost:8000`, { transports: ['websocket'] });
import styles from "../styles/Login.module.css";

export default function Home() {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = data => {

    socket.emit('req-connection', data.username);
    socket.on('res-connection', (res) => {

      if (res) {
        
        swal({
          title: 'Success',
          text: 'Login complete',
          icon: 'success',
          button: 'Ok'
        });

        sessionStorage.setItem("username", data.username);
        window.location = '/Chat';

      } else {
        
        swal({
          title: 'Error',
          text: 'This username is alredy in use',
          icon: 'error',
          button: 'Ok',
          timer: '1500'
        })

      }
    })
  };

  return (
    <div className="m-4">

      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossorigin="anonymous"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" />
      </Head>

      <h1>App Chat <em>(Next.js + Socket.io + Express)</em> </h1>
      <h2 className="m-4">Login</h2>

      <div className={styles.root}>
        <Card className={styles.login} variant="outlined">
          <form onSubmit={handleSubmit(onSubmit)} >
            <CardContent>
              <div className={styles.userIcon}>
                <AccountCircleIcon style={{ fontSize: 150 }} color="primary" />
              </div>
              <Typography variant="h5" component="h2">
                Sign in
              </Typography>
              <br />
              <Typography color="textSecondary">
                Enter your username:
              </Typography>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">@</span>
                <input {...register("username")} className="form-control" placeholder="Username" />
              </div>
              <p className={styles.errors}>{errors.username?.message}</p>
            </CardContent>
            <CardActions>
              <button type="submit" className="btn btn-primary m-4">Join</button>
            </CardActions>
          </form>
        </Card>
      </div>

    </div>
  )

}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
});
