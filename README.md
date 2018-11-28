[![](https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-nodejs-lightgrey.svg?style=flat)](https://developer.ibm.com/node/cloud/)

# Create and deploy a serverless Node.js application

> We have similar patterns available for [Swift](https://github.com/IBM/serverless-app-swift) and [Python](https://github.com/IBM/serverless-app-python), as well!

This repository has code to create a serverless Backend for Frontend ([BFF](https://samnewman.io/patterns/architectural/bff/)) using Node.js and IBM Cloud Functions, backed by a NoSQL database. No full stack application management required. Cloud Functions supplies basic Create, Read, Update, and Delete operations in a serverless environment. These functions are mapped to an API gateway, which can be integrated into an iOS app, for example, to enable persistence of data into a Cloudant NoSQL Database.

When you have completed this code pattern, you will understand how to:

* Create a set of Cloud Function Actions that manage the database integration
* Integrate this Backend for Frontend within your Mobile or Web apps
* Manage the release of the Cloud Functions with a DevOps pipeline

## Included Components

* [Cloudant NoSQL DB](https://console.bluemix.net/catalog/services/cloudant): A fully managed data layer designed for modern web and mobile applications that leverages a flexible JSON schema.
* [API Connect](http://developer.ibm.com/apiconnect/): Create and run secure APIs and microservices.
* [Continuous Delivery](https://console.bluemix.net/catalog/services/continuous-delivery): Enable tool integrations that support your development, deployment, and operation tasks.
* [GitLab](https://about.gitlab.com/): GitLab unifies issues, code review, CI, and CD into a single UI.
* [AppID](https://console.bluemix.net/catalog/services/app-id): Use the IBM Bluemix App ID service to add authentication to your mobile and web apps and protect your back-end systems.

## Featured Technologies

* [Serverless](https://www.ibm.com/cloud-computing/bluemix/openwhisk): An event-action platform that allows you to execute code in response to an event.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

## Steps

1. [Install developer tools](#1-install-developer-tools)
1. [Configure your DevOps pipeline](#2-configure-your-devops-pipeline)
1. [Deploy your serverless application](#3-deploy-your-serverless-application)
1. [Integrate with your own frontend application](#4-integrate-with-your-own-frontend-application)

### 1. Install developer tools

- [IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html)
- Cloud Functions Plugin:
  ```bash
  ibmcloud plugin install Cloud-Functions -r IBM Cloud
  ```
- [Whisk Deploy CLI](https://github.com/apache/incubator-openwhisk-wskdeploy/releases)

### 2. Configure your DevOps pipeline

The `.bluemix` directory contains all of the configuration files that the toolchain requires to function. At a minimum, the `.bluemix` directory must contain the following files:

- `toolchain.yml`
- `deploy.json`
- `pipeline.yml`

Detailed information regarding toolchain configuration can be found in our [docs](https://console.bluemix.net/docs/services/ContinuousDelivery/toolchains_custom.html#toolchains_custom).

Update the toolchain (`.bluemix/toolchain.yml`) with your desired changes.

Login into the IBM Cloud, substituting your own values for `<api>`, `<org>`, and `<space>`:

```bash
ibmcloud login -a <api> -o <org> -s <space>
```

Push your application to stage the toolchain:

```bash
ibmcloud app push
```

### 3. Deploy your serverless application

Your application is deployed using the IBM Continuous Delivery pipeline. Your toolchain provides an integrated set of tools to automatically build, deploy, and manage your apps.

#### Manage Cloud Functions and API Connect Manually

Download your code locally by navigate to your App dashboard from the [Apple Development Console](https://console.bluemix.net/developer/appledevelopment/apps) or [Web Apps Console](https://console.bluemix.net/developer/appservice/apps) and select **Download Code**.

You have the option to perform either a [Local Deployment](#local-deployment) or an [IBM DevOps deployment](#ibm-devops-deployment).

##### Local Deployment

If you're on Mac or Linux, ensure the `deploy.sh` script is executable and run it:

```
chmod +x deploy.sh
./deploy.sh
```

Or, if you'd rather run the `wskdeploy` command directly, you use the `--param` command line flags to provide values for the `services.cloudant.database` and `services.cloudant.url` values.

```bash
/wskdeploy -m "manifest.yml" --param "services.cloudant.url" "<url>" --param "services.cloudant.database" "products"
```

Where `<url>` is the URL value from your Cloudant service credentials.

##### IBM DevOps Deployment

Once you have connected your app to IBM Devops you need to add your Cloudant URL to the delivery pipeline environment variables. Note: this is a one-time action.

First click on the **Cloudant** service link when viewing the app dashboard.  Then click on **Service Credentials**, and then click on the **View Credentials** link for your Cloudant instance.  Copy the `url` value for use in the delivery pipeline.

Next, go back to your app dashboard and click **View Toolchain**, then click on the **Delivery Pipeline**.   The delivery pipeline may have executed without any errors, but you need to specify the Cloudant URL before the Cloud Functions actions will operate as expected.  Next, click on the gear icon for the **DEPLOY** phase, then click **Configure Phase** and click **Environment Properties**.  Paste the Cloudant URL for the `DATABASE_URL` environment variable.

Next, run your **DEPLOY** phase again to complete the deployment.

### 4. Integrate with your own frontend application

Cloudant NoSQL DB provides access to a fully managed NoSQL JSON data layer that's always-on. This service is compatible with CouchDB, and accessible through a simple to use HTTP interface for mobile and web application models.

You can then review the [Actions](https://console.bluemix.net/openwhisk/actions) in the IBM Cloud Console interface, along with your [Cloud Functions APIs](https://console.bluemix.net/openwhisk/apimanagement).

<table>
  <thead>
      <tr>
        <th>Method</th>
        <th>HTTP request</th>
        <th>Description</th>
      </tr>
  </thead>
  <tbody>
    <tr>
      <td>Create</td>
      <td>POST /database</td>
      <td>Inserts an object</td>
    </tr>
    <tr>
      <td>Read</td>
      <td>GET /database/<font color="#ec407a">objectId</font></td>
      <td>Retrieves an object</td>
    </tr>
    <tr>
      <td>ReadAll</td>
      <td>GET /database</td>
      <td>Retrieves all objects</td>
    </tr>
    <tr>
      <td>Delete </td>
      <td>DELETE /database/<font color="#ec407a">objectId</font></td>
      <td>Deletes an object</td>
    </tr>
    <tr>
      <td>DeleteAll</td>
      <td>DELETE /database</td>
      <td>Deletes all objects</td>
    </tr>
    <tr>
      <td>update</td>
      <td>PUT /database/<font color="#ec407a">objectId</font></td>
      <td>Updates content of an object</td>
    </tr>
  </tbody>
</table>

## License

This code pattern is licensed under the Apache Software License, Version 2. Separate third party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the Developer [Certificate of Origin, Version 1.1](https://developercertificate.org/) ("DCO") and the [Apache Software License, Version 2](LICENSE).

[I'm not a lawyer. What does this mean?](http://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
