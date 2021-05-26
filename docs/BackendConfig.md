---
title: Backend Config
has_children: true
---

# Backend Config

All config files are in /backend/config

## auth.config

## cors.config

## db.config

## logging.config

Logging the application.
Default will log all events to /backend/logs/info.log and errors to /backend/logs/error.log.

- logDirectory: Specify custom log directory e.g. /opt/logs/cc
- grayLog: Graylog conig. If uncommented will log to graylog. Use winston-graylog2 package options here.
- logToConsole: If true will output all logs to console

## orca.config

