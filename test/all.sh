dir=`dirname $0`
for file in `find $dir -name "*.js"`; do 
  echo ">>> $file"
  jsoptimize $file
  echo
done
