
# Penpot for Uxmal Collab

## System requirements

To run penpot locally you should have installed `docker` and `docker compose v2`.

## Configuring the project

Before starting the project there are some changes that have to be done so penpot is configured correctly.

1. In the `docker/devenv/docker-compose.yaml` change the `PENPOT_SECRET_KEY` key value to the real one.

## Starting the project

To start the project locally:

- Run `npm run start:local` to start the project locally, this will run several docker containers but the frontend penpot application will be in [http://localhost:3449](http://localhost:3449).

- Run `npm run stop:local` to stop the docker containers.

You can see the full penpot developer guide [here](https://help.penpot.app/technical-guide/developer/devenv/#system-requirements).

## Uxmal Penpot for developers

Everytime a penpot resource is open from uxmal collab, it should be open with the URL queries `email` and `password`, these queries are the user credentials and they will be used to skip the default authentication in penpot and do it automatically, this is needed because penpot after calling the login endpoint sets an http only authentication cookie, how it can only be accessed from the penpot server there is no way to get it in frontend, (the only way would be doing deeper changes in the project which we try to avoid for integrate better the further changes the penpot team do).

So to access a penpot resource would look like `<PENPOT-DOMAIN>/#/workspace?team-id=5b06b9bf-f166-8020-8005-bb5f1aecb4a0&file-id=5b06b9bf-f166-8020-8005-bb5d03827855&page-id=5b06b9bf-f166-8020-8005-bb5d0382dfb9&layout=layers&email=test@test.com&password=123123` after the login the uxmal penpot app will remove the user credentials from the URL.

You can also pass some options through queries:

- `access` can be either `restricted` or `full`, besides the configured permissions inside penpot like if you can edit or only view the design, there are some other UI that uxmal penpot can hide, like navigation to projects, design settings, comments and so on, the `restricted` option will hide all the unwanted UI and will practically leave only the design, `full` option will leave the default penpot UI for the configured permissions. example:

`...&access=restricted`

## Api

<table>
    <tr>
        <th>Endpoint</th>
        <th>Payload</th>
        <th>Response</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>
            <pre>POST < PENPOT-DOMAIN >/api/rpc/command/prepare-register-profile</pre>
        </td>
        <td>
            <pre>
{
    "~:email": String,
    "~:password": String
}
            </pre>
        </td>
        <td>
            <pre>
{
    "~:token": String
}
            </pre>
        </td>
        <td>
            Starts an user registration, this should be the first api call on the registration process. The token response should be saved and use for the next api request
        </td>
    </tr>
    <tr>
        <td>
        <pre>POST < PENPOT-DOMAIN >/api/rpc/command/register-profile</pre>
        </td>
        <td>
            <pre>
{
    "~:token": String,
    "~:fullname": String
}
            </pre>
        </td>
        <td>
            <pre>
{
    "~:email":"test3@test.com"
}
            </pre>
        </td>
        <td>
            Ends the registration process, this api call should be done after the prepare registration endpoint call. After this api call penpot will send a verification mail, the user will have to click the verify button in the mail to complete the registration.
        </td>
    </tr>
    </tr>
    <tr>
        <td>
        <pre>POST < PENPOT-DOMAIN >/api/rpc/command/login-with-password</pre>
        </td>
        <td>
            <pre>
{
    "~:email": String,
    "~:password": String
}
            </pre>
        </td>
        <td>
            The important part of this response is the cookie in the headers, because the token inside the cookie is the one used to authenticate the user. Example
            <pre>
auth-token=eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2R0NNIn0.1HGIXxPaVSIJnd-ZlUEVFLkdAaxmOZzTkm8WcwaoUZUrwzU8IJMKUw.dYnZrX0MkSy60wr-.Xn4dOk6VcV5AK68M5g3Cb2JHrh7dGGG0guI10DzUIekaKzP-jEf6AHa4vF4J0ptHEnaIhZn_eoTNIOl01z8H-CZ6Y8mUs67puxdQS3b2F_K7sgXuumtIZp0TwjP8CsBPLtbUT8X_7H0CqQ.34zuONdFnCRVGKsysHM2pg; Version=1; Path=/; HttpOnly; Expires=Wed, 19 Feb 2025 20:44:53 GMT; Comment="Renewal at: Thu, 13 Feb 2025 02:44:53 GMT"; SameSite=Lax
            </pre>
        </td>
        <td>
            Log in the user into the penpot app.
        </td>
    </tr>
</table>

You can see the full penpot api documentation [here](https://design.penpot.app/api/_doc)

