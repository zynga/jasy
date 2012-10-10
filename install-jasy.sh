#!/bin/bash

##########################################################################
# Copyright Zynga Corp - 2012
#
# install-jasy.sh : Bash Script to install Jasy
# 
##########################################################################

# Mixpanel helper routines
# Usage : track_event EVENT_NAME 
MIXPANEL_TOKEN="cdd7359ea0c86f5b58f074f369829e41"

function track_event {
# $1 : EVENT_NAME

if [ -z $1 ]
then
	EVENT_NAME= "unknown"
else
	EVENT_NAME=$1
fi

# $2 : extra properties to be passed to Mixpanel
# Format is : \"PROPERTY1_NAME\" : \"PROPERTY1_VALUE\",\"PROPERTY2_NAME\" : \"PROPERTY2_VALUE\"
if [ -n $2 ]
then
	TRACK_DATA_EXTRA_PROPERTIES=",$2"
else
	TRACK_DATA_EXTRA_PROPERTIES=""
fi

TRACK_DATA_PROPERTIES="\"properties\":{\"token\":\"$MIXPANEL_TOKEN\",\"distinct_id\":\"$DISTINCT_ID\" $TRACK_DATA_EXTRA_PROPERTIES}"
TRACK_DATA="{$TRACK_DATA_PROPERTIES,\"event\":\"$EVENT_NAME\"}"
ENCODED_TRACK_DATA=`echo $TRACK_DATA | base64`
MIXPANEL_API_ENDPOINT="https://api.mixpanel.com/track/?data=$ENCODED_TRACK_DATA"

if [ -n $ENABLE_TRACKING ]
then
	curl -s -X POST $MIXPANEL_API_ENDPOINT > /dev/null
fi
}

# Track the install of required command
# Usage : track_command_install COMMAND METHOD STEP
function track_command_install {
track_event INSTALL "\"command\":\"$1\", \"method\":\"$2\",\"step\":\"$3\""
}

# Function to grab the Mac Address of the local machine using a local Python install (This will work on MacOS/Linux but not Windows)
function get_mac_address {
echo `python -c "from uuid import getnode as get_mac; print get_mac()"`
}

# Routine to check whether an executable is already installed, if not provide a helpful error message and 
function check_exec {
  EXIT="echo 1"
  if [ -z "$2" ]
    then
      OUTPUT="$1"
    else
      OUTPUT="$2"
    fi
  
  if [ -z "$3" ]
    then
      HELP="Aborting"
    else
      HELP="$3"
    fi

  if [ -n "$4" ]
    then
      EXIT="$4"
    fi
  command -v $1 >/dev/null 2>&1 || { echo "[Info] I require $OUTPUT but it's not installed. $HELP." >&2; track_event CHECK_EXEC "\"command\":\"$1\",\"installed\":\"false\""; $EXIT; }
  track_event CHECK_EXEC "\"command\":\"$1\",\"installed\":\"true\""

}

# Python3 Install Action with homebrew for MacOS
function do_install_python3_with_brew {
  check_exec "brew" "Homebrew" "Please see install instructions here : http://bit.ly/Sv5lhA" "exit 1"
  track_command_install "python3" "brew" "start"
  brew update && brew install python3 
  track_command_install "python3" "brew" "complete"
  track_event CHECK_EXEC "\"command\":\"python3\",\"installed\":\"true\""
}

# Python3 Install Action with yum for Redhat/Centos derivatives
function do_install_python3_with_yum {
  track_command_install "python3" "yum" "start"
  sudo yum install python3
  track_command_install "python3" "yum" "complete"
  track_event CHECK_EXEC "\"command\":\"python3\",\"installed\":\"true\""
}

# Python3 Install Action with apt-get for Debian/Ubuntu derivatives
function do_install_python3_with_deb {
  track_command_install "python3" "apt-get" "start"
  sudo apt-get install python3
  track_command_install "python3" "apt-get" "complete"
  track_event CHECK_EXEC "\"command\":\"python3\",\"installed\":\"true\""
}

# PIP Install Action
function do_install_pip {
  track_command_install "pip" "curl" "start"
  curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python3
  track_command_install "pip" "curl" "complete"
  track_event CHECK_EXEC "\"command\":\"pip\",\"installed\":\"true\""
}

# Jasy Install Action
function do_install_or_update_jasy {
  track_command_install "jasy" "pip" "start"
  pip-3.2 install -U jasy
  track_command_install "jasy" "pip" "complete"
  track_event CHECK_EXEC "\"command\":\"jasy\",\"installed\":\"true\""
}

# Python3 Install with Brew
function check_python3_and_install {
  executable="python3"
  executable_pretty_print="python3"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result == "0" ]]; then
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"false\""
      do_install_python3_with_brew
    else
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"true\""
      echo "[Info] Found $executable_pretty_print"
    fi
}

# PIP Install
function check_pip_and_install {
  executable="pip-3.2"
  executable_pretty_print="pip"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result == "0" ]]; then
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"false\""
      do_install_pip
    else
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"true\""
      echo "[Info] Found $executable_pretty_print"
  fi
}

# Jasy Install
function check_jasy_and_install {
  executable="jasy"
  executable_pretty_print="jasy"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result == "0" ]]; then
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"false\""
      do_install_or_update_jasy
    else
      track_event CHECK_EXEC "\"command\":\"$executable\",\"installed\":\"true\""
      echo "[Info] Found $executable_pretty_print"
  fi
}

# Main function
function main {
  DISTINCT_ID=`get_mac_address`
  
  ENABLE_TRACKING="True"
  echo "[Info] Starting Jasy install!"
  case $OSTYPE in 
    darwin*) platform="MacOS"; echo Detected MacOS ;;
    linux*) platform="Linux"; echo Detected Linux ;;
    *) platform="$OSTYPE"; echo Detected $OSTYPE ;;
  esac
  
  track_event START "\"platform\":\"$platform\""
  if [[ $platform == "MacOS" ]]; then
    check_python3_and_install
  else
    echo "This is an unsupported platform : $platform"
    exit 1;
  fi
  
  check_exec "curl"
  check_exec "base64"
  check_pip_and_install
  check_jasy_and_install
  
  echo "[Info] Finished - Jasy is ready to use!"
  echo "[Info] Optional Dependencies check :"
  jasy doctor
  track_event COMPLETE "\"status\":\"$?\""
}

# Run!
main
