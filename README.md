

## API endpoints

1. **User Routes**
   - `POST /api/users/signup`: Sign up a new user.
   - `POST /api/users/login`: Log in an existing user.

2. **Token Routes**
   - `POST /api/tokens`: Create a new token.
   - `DELETE /api/tokens/:token`: Delete a token.
   - `PUT /api/tokens/:token`: Update a token details.

3. **Rooms Routes**
   - `GET /api/rooms`: Get all rooms.
   - `GET /api/rooms/:roomId/call-next`: Call the next token in the specified room.
   - `GET /api/rooms/:roomId/end-current`: End/Complete the current token in the specified room.

4. **Status Routes**
   - `GET /api/status`: Get the status of waiting rooms.