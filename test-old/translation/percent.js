function wrapper()
{
	alert(this.tr("Hello World"));
	alert(tr("Short"));
	alert(qx.locale.Manager.getInstance().tr("Thank you for the flowers"));
	
	alert(tr("Guten %1", "Morgen"))
	alert(tr("Guten %1! %1!", "Morgen"))
	alert(tr("Guten %1! %1!", this.computeGreeting()))

	alert(trc("Chat (noum)", "Chat"));
	alert(trc("Chat (noum) %1", "Chat %1", "Online"));
	alert(trc("Chat (noum) %1", "Chat %1", this.getChatStatus()));

	var newMails = 5;
	alert(trn("You have got a new mail", "You have got new mails", newMails));
	alert(trn("You have got a new mail", "You have got %1 new mails", newMails, newMails));

	// Register strings in translation file (will be compiled out)
	// According to doc, marktr() does mark for tranlsation, but always returns the original text.
	marktr("Dog");
	marktr("Cat");
	marktr("Bird");

	// After marking the text these can be used for translation
	var objs = ["Dog","Cat","Bird"];
	for (for var i=0, l=objs.length; i<l; i++) {
		alert(tr(objs[i]));
	}
	
	var giftFlowers = 3;
	alert("Sarah send you a flower", "Sarah send you %1 flowers", giftFlowers, giftFlowers)
}

