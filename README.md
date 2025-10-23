# Aligo

Passwordless self-hosted auth middleware.  
Reverse-proxy in front of your backend using TOTP-based login.  
Single Docker container, SQLite storage, no external services.

---

## TODO

- [ ] Reverse proxy core (check session → proxy or show login)
- [ ] User model (username + TOTP)
- [ ] Admin user (password + optional TOTP)
- [ ] Session cookie handling
- [ ] Invite system (one-time + reusable)
- [ ] Setup page (QR + recovery codes)
- [ ] Basic admin dashboard
- [ ] SQLite persistence
