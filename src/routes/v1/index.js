const express = require('express');
const authSchEmpRoute = require('./authSchEmp.route');
const userRoute = require('./user.route');
// const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authSchEmpRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
];

if (config.nodeEnv == 'development') {
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
} else if (config.nodeEnv == 'production') {
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
} else if (config.nodeEnv == 'staging') {
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}else{
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}


module.exports = router;