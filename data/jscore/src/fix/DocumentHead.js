// Fix for missing document.head
if (!document.head) {
	document.head = document.getElementsByTagName('head')[0]
}