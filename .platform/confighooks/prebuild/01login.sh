#!/bin/bash
USER=$(/opt/elasticbeanstalk/bin/get-config env -k USER)
PASSWD=$(/opt/elasticbeanstalk/bin/get-config env -k PASSWD)

echo $PASSWD | docker login -u $USER --password-stdin