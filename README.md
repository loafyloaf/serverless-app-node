[![](https://img.shields.io/badge/IBM%20Cloud-powered-blue.svg)](https://bluemix.net)
[![Platform](https://img.shields.io/badge/platform-nodejs-lightgrey.svg?style=flat)](https://developer.ibm.com/node/cloud/)

# Create and deploy a serverless Node.js application

This repository has code to create a serverless application using Node.js and IBM Cloud Functions.

## Requirements

- [IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html)
- Cloud Functions Plugin:
  ```bash
  ibmcloud plugin install Cloud-Functions -r IBM Cloud
  ```
- [Whisk Deploy CLI](https://github.com/apache/incubator-openwhisk-wskdeploy/releases)

## Configuration

The `.bluemix` directory contains all of the configuration files that the toolchain requires to function. At a minimum, the `.bluemix` directory must contain the following files:

- `toolchain.yml`
- `deploy.json`
- `pipeline.yml`

Detailed information regarding toolchain configuration can be found in our [docs](https://console.bluemix.net/docs/services/ContinuousDelivery/toolchains_custom.html#toolchains_custom).

1. Update the toolchain with your desired changes.
2. After updating the toolchain files with your desired changes push your application to restage the toolchain
   ```bash
   ibmcloud app push
   ```

## Deployment

Your application is deployed using the IBM Continuous Delivery pipeline. Your toolchain provides an integrated set of tools to build, deploy, and manage your apps.

### Managing Cloud Functions and API Connect Manually

1. Download your code locally by navigate to your App dashboard from the [Apple Development Console](https://console.bluemix.net/developer/appledevelopment/apps) or [Web Apps Console](https://console.bluemix.net/developer/appservice/apps) and select `Download Code`.
2. Login into the IBM Cloud
   ```bash
   ibmcloud login -a <api> -o <org> -s <space>
   ```
3. **Local Deployment:** Execute the deploy script.  If you're on Mac or linux, you can run the `deploy.sh` helper script.
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   Or, if you'd rather run the `wskdeploy` command directly, you use the `--param` command line flags to provide values for the `services.cloudant.database` and `services.cloudant.url` values.
   ```bash
   /wskdeploy -m "manifest.yml" --param "services.cloudant.url" "<url>" --param "services.cloudant.database" "products"
   ```

   Where `<url>` is the URL value from your Cloudant service credentials.

   **IBM DevOps Deployment:** Once you have connected your app to IBM Devops by clicking on the "Deploy To Cloud" you need to add your Cloudant URL to the delivery pipeline environment varaibles. Note: this is a one-time action.

   First click on the "Cloudant" service link when viewing the app dashboard.  Then click on "Service Credentials", and then click on the "View Credentials" link for your Cloudant instance.  Copy the "url" value for use in the delivery pipeline.

   Next, go back to your app dashboard and click "View Toolchain", then click on the "Delivery Pipeline".   The delivery pipeline may have executed without any errors, but you need to specify the Cloudant URL before the Cloud Functions actions will operate as expected.  Next, click on the gear icon for the "DEPLOY" phase, then click "Configure Phase" and click "Environment Properties".  Paste the Cloudant url for the "DATABASE_URL" environment variable.

   Next, run your DEPLOY phase again to complete the deployment.
4. Review the actions in the IBM Cloud Console [Cloud Functions](https://console.bluemix.net/openwhisk/actions)
5. Review API for the actions in the IBM Cloud Console [Cloud Functions APIs](https://console.bluemix.net/openwhisk/apimanagement)

## Services

This application is configured to connect with the following services:

### Cloudant

Cloudant NoSQL DB provides access to a fully managed NoSQL JSON data layer that's always on. This service is compatible with CouchDB, and accessible through a simple to use HTTP interface for mobile and web application models.

### Cloud Function APIs

#### Cloudant Actions

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
      <td colspan="3">
      URIs relative to https://openwhisknot-used.net/api/v1/web/undefined_undefined/serverlessappnode </td>
    </tr>
    <tr>
      <td>Create</td>
      <td>POST /database </td>
      <td>Inserts an object</td>
    </tr>
    <tr>
      <td>Read</td>
      <td>GET /database/<font color="#ec407a">objectId</font></td>
      <td>Retrieves an object</td>
    </tr>
    <tr>
      <td>ReadAll</td>
      <td>GET /database </td>
      <td>Retrieves all objects</td>
    </tr>
    <tr>
      <td>Delete </td>
      <td>DELETE /database/<font color="#ec407a">objectId</font></td>
      <td>Deletes an object</td>
    </tr>
    <tr>
      <td>DeleteAll</td>
      <td>DELETE /database </td>
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

[Apache 2.0](LICENSE)
