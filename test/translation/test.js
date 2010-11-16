function wrapper()
{
  alert(this.tr("Hello World"));
  alert(tr("Short"));
  alert(qx.locale.Manager.getInstance().tr("Thank you for the flowers"));
  
  alert(tr("Guten %1", "Morgen"))

  alert(trn("You have got a new mail", "You have got new mails", newMails));
  alert(trn("You have got a new mail", "You have got %1 new mails", newMails, newMails));

  alert(trc("Chat (noum)", "Chat"));
}

