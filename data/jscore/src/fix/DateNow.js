(function(Date) 
{
	if (!Date.now) 
	{
		Date.now = function() {
			return +new Date;
		};
	}
})(Date);
