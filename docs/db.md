# Database Server Configuration

## MongoDB

Additional customizing is required for mongodb after initial setup.

1. Create a user administration account. This user only has privileges to manage users and roles, so you can use it to create other users that have permission to manage actual databases. (Details: https://docs.mongodb.com/manual/tutorial/enable-authentication/)

    ```bash
    mongo --port 27017
    ```

    ```js
    use admin

    db.createUser(
      {
        user: 'userAdmin',
        pwd: 'ADMINPASSWORD',
        roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
      }
    )
    ```

2. Return to bash (or zsh, etc) shell: <kbd>^</kbd> <kbd>d</kbd>
3. Update `/usr/local/etc/mongodb.conf`

    ```bash
    security:
      authorization: "enabled"
    ```

4. Restart mongod with auth

    ```bash
    brew services restart mongodb-community --auth
    ```

5. Start a mongo shell with `userAdmin`

    ```bash
    mongo --port 27017 -u "userAdmin" -p "ADMINPASSWORD" --authenticationDatabase "admin"
    ```

6. Create a superuser

    ```js
    use admin

    db.createUser({
      user: "[USERNAME]",
      pwd: "[YOURPASSWORD]",
      roles: [
        { role: "dbAdminAnyDatabase", db: "admin" },
        { role: "readWriteAnyDatabase", db: "admin" },
      ]
    })

    ```

## RethinkDB

Additional customizing is required for rethinkdb after initial setup.

### Change port

You'll probably want to change the host port from `:8080` to one that won't clobber a lot of local dev sites — something like `:8090`.

* Open `/usr/local/etc/rethinkdb.conf`
* Uncomment the `http-port` line and change the value to 8090
* Run `brew services restart rethinkdb`

### Set up permisions

* Open the data explorer in the RethinkDb admin (e.g. http://localhost:8090)
* Set password for admin user

    ```js
    r.db('rethinkdb').table('users').get('admin').update({password: '[YOURPASSWORD]'})
    ```

* Create a new user

    ```js
    r.db('rethinkdb').table('users').insert(({id: '[USERNAME]', password: '[YOURPASSWORD]'})

    ```

* Grant the new user privileges. For example, granting privileges across all databases:

    ```js
    r.grant('[USERNAME]', {read: true, write: true, config: true})
    ```
