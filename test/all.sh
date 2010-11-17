dir=`dirname $0`

for file in `find $dir/compressor -name "*.js"`; do 
  jscompress $file > tmp.js
  diff tmp.js $file.res > /dev/null  && echo ">>> $file: OK" || echo ">>> $file: FAIL"
done

for file in `find $dir/blockreducer $dir/combinedeclarations $dir/localvariables $dir/translation $dir/unusedcleaner $dir/valuepatch -name "*.js"`; do 
  jsoptimize $file > tmp.js
  diff tmp.js $file.res > /dev/null && echo ">>> $file: OK" || echo ">>> $file: FAIL"
done

rm -f tmp.js