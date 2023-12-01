# nsecbunker

nsecBunker is a product that allows users to remotely and securely use their keys.

One of the challenges to nostr adoption among teams/organizations is the fact that
users need to share secrets (aka nsecs) to access an organization account.

nsecBunker provides users a unified backend where they can keep their secrets and
guard access to this key via nostr keys.

```
+------------+
| Team Key 1 | ---\                      +--------+
+------------+     \   +------------+    | User 1 |
                    }> | nsecBunker | <> | User 2 |
+------------+     /   +------------+    | User 3 |
| Team Key 2 | ---/                      +--------+
+------------+
```

nsecbunker is the software that enables any number of users (using their own nostr private keys)
to access one ore more organization/team accounts. When User A wants to use Team Key 1, the user
generates a nostr event and puts this event, without a signature, as the payload of another
nostr event, which is signed with User 1's key and sent to nsecBunker. nsecBunker checks it's signing
policy to make sure User 1 has authorizations to do what is being requested. If it is, nsecBunker signs
the event's payload and returns the signed event to User 1, which might choose to publish the event.

## Concepts

### Team Key
Key(s) that users want to sign as. These are the private keys
nsecbunker holds internally and does NEVER disclose, it rather
uses these keys to sign events and shares the signatures as requested by users.

### User / User Keys
Users have their own keys to request things from nsecBunker.


nsecBunker holds 1+ keys. Any number of users (which)

# nsecbunker UI

This is the admin UI for nsecBunker. This program runs in the same environment
as the `nsecbunckerd` process. This UI and `nsecbunkerd` use the same database
backend.

## Settings
`nsecbunkerd` settings are stored on an `nsecbunkerd.json` file.

## UI Workflow

### Onboarding
* when a new instance of `nsecbunkerd` starts, it is configurable, which means that it will
generate a secret and allow

### Login
* User needs to enter a passphrase to unlock the `nsecbunkerd` process. The passphrase
is posted to `nsecbunkerd`'s backend.

* User will see a list of keys that might need to be decrypted. The user will need to
enter a passphrase for each key and send them to the backend for decryption.

* The server will respond with a JWT. The JWT might be saved on the session storage (show
checkbox with "remember" option to the user).

* Upon login the user can see all tabs.

### Users
The users interface allows the administrator to manage the user keys that have access to each
backend key.

# Author

* [pablof7z](https://nostr.me/npub1l2vyh47mk2p0qlsku7hg0vn29faehy9hy34ygaclpn66ukqp3afqutajft)
