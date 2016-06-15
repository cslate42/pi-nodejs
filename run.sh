#!/bin/bash
# TODO use pm2
pwd=$(pwd)

sudo nodejs --harmony "$pwd/app.js"
