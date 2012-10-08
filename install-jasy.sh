#!/bin/bash

##########################################################################
# Copyright Zynga Corp - 2012
#
# install-jasy.sh : Bash Script to install Jasy
# 
##########################################################################

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
  command -v $1 >/dev/null 2>&1 || { echo "[Info] I require $OUTPUT but it's not installed. $HELP." >&2; $EXIT; }
}

# Python3 Install Action with homebrew for MacOS
function do_install_python3_with_brew {
  brew update && brew install python3 
}

# Python3 Install Action with yum for Redhat/Centos derivatives
function do_install_python3_with_yum {
  sudo yum install python3
}

# Python3 Install Action with apt-get for Debian/Ubuntu derivatives
function do_install_python3_with_deb {
  sudo apt-get install python3
}

# PIP Install Action
function do_install_pip {
  curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python3
}

# Jasy Install Action
function do_install_or_update_jasy {
  pip-3.2 install -U jasy
}

# Python3 Install with Brew
function check_python3_and_install {
  executable="python3"
  executable_pretty_print="python3"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result ]]; then
      do_install_python3_with_brew
    else
      echo "[Info] Found $executable_pretty_print"
    fi
}

# PIP Install
function check_pip_and_install {
  executable="pip-3.2"
  executable_pretty_print="pip"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result ]]; then
      do_install_pip
    else
      echo "[Info] Found $executable_pretty_print"
  fi
}

# Jasy Install
function check_jasy_and_install {
  executable="jasy"
  executable_pretty_print="jasy"
  executable_action="Installing ..."
  result=`check_exec $executable $executable_pretty_print $executable_action`
  if [[ $result ]]; then
      do_install_or_update_jasy
    else
      echo "[Info] Found $executable_pretty_print"
  fi
}

# Main function
function main {
  echo "[Info] Starting Jasy install!"
  case $OSTYPE in 
    darwin*) platform="MacOS"; echo Detected MacOS ;;
    linux*) platform="Linux"; echo Detected Linux ;;
    *) platform="$OSTYPE"; echo Detected $OSTYPE ;;
  esac
  
  if [[ $platform == "MacOS" ]]; then
    check_exec "brew" "Homebrew" "Please see install instructions here : http://bit.ly/Sv5lhA" "exit 1"
    check_python3_and_install
  else
    echo "This is an unsupported platform : $platform"
    exit 1;
  fi
  
  check_exec "curl"
  check_pip_and_install
  check_jasy_and_install
  
  echo "[Info] Finished - Jasy is ready to use!"
  echo "[Info] Optional Dependencies check :"
  jasy doctor
}

# Run!
main
