# GTN HoloRecord

Author: Andrew Jessen-Tyler
Version: 0.0.1

## ENV Variables Required

SQL_ADDRESS: Set to postgres url for the database that will contain all the tables from this app.

NODE_ENV: Node enviornment. Default is development.

PORT: Port to run app from. Default is 8000.


## Express Methods and Requirements

Note: headers should always be set to {"Content-Type": "application/json"}

GET / - Displays a welcome message and links to this ReadMe on github.
GET /googleAuth/validateToken, body: {access_token: string, email: string, google_id: string} - Checks if the token sent is valid and matches the user email and google id.
GET /users/exists, body: {google_id: number} - Checks if this google id is assigned to a user in the user_list table of the postgres database.
POST /users/newUser, body: { user_google_id: number, user_email: string, tos_agreement: boolean, age_confirmation: boolean, user_name: string } - Inserts the new user into the user_list table of the postgres database.
GET /db/dbInfo, body: {db_id: number} - Checks if a primary key of db_id exists in the db_list table of the postgres database.
GET /db/allUsersDB, body: {user_id: number} - Returns all db from the db_list table of the postgres database that have the owner_user_id the same as the inputted user_id.
POST /db/newDB, body: {owner_user_id: number, server_name: string} - Inserts the new db into the db_list table of the postgres database.
GET /users/exists, body: {item_name: string} - Checks if this item name is present in the item_list table of the postgres database. It is highly reccomended to use the exact item name as it appears in the SWTOR game.
POST /db/newDB, body: {item_name: string, vendor_cost: number (optional)} - Inserts the new item into the item_list table of the postgres database. It is highly reccomended to use the exact item name as it appears in the SWTOR game.