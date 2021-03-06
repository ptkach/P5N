const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const restful = require('node-restful');
const mongoose = restful.mongoose;
const schemas = require('./schemas');
const path = require('path');

const apprest = express();
const testDataLoader = require('./test/dataLoader');
const testReportLoader = require('./test/testReportLoader');

apprest.use(express.static(path.join(__dirname, 'public/p5client/build')));
apprest.use(morgan('dev'));
apprest.use(bodyParser.urlencoded({'extended': 'true'}));
apprest.use(bodyParser.json());
apprest.use(bodyParser.json({type: 'application/vnd.api+json'}));
apprest.use(methodOverride());

mongoose.connect("mongodb://localhost/metricsKeeper");

const defaultRestMethods = ['get', 'post', 'put', 'delete'];
const readOnlyRestMethods = ['get'];

const PortfolioResource = apprest.resource = restful.model('Portfolio', schemas.portfolioSchema)
    .methods(defaultRestMethods);
PortfolioResource.route('loadTestData', function (req, res, next) {
    //testDataLoader(mongoose);
    testReportLoader(mongoose, 10);
    res.send("Completed test data load");
});
PortfolioResource.register(apprest, '/rest/portfolio');

const ProjectResource = apprest.resource = restful.model('Project', schemas.projectSchema)
    .methods(defaultRestMethods);
ProjectResource.register(apprest, '/rest/project');

const MetricGroupResource = apprest.resource = restful.model('MetricGroup', schemas.metricGroupSchema)
    .methods(defaultRestMethods);
MetricGroupResource.register(apprest, '/rest/metricgroup');

const MetricTypeResource = apprest.resource = restful.model('MetricType', schemas.metricTypeSchema)
    .methods(defaultRestMethods);
MetricTypeResource.register(apprest, '/rest/metrictype');

const MetricResource = apprest.resource = restful.model('Metric', schemas.metricSchema)
    .methods(defaultRestMethods);
MetricResource.register(apprest, '/rest/metric');

const MetricReportResource = apprest.resource = restful.model('MetricReport', schemas.metricReportSchema)
    .methods(defaultRestMethods);
MetricReportResource.register(apprest, '/rest/metricreport');

apprest.listen(3000);