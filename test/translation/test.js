function wrapper()
{
  alert(this.tr("Hello World"));
  alert(tr("Short"));
  alert(qx.locale.Manager.getInstance().tr("Thank you for the flowers"));

  alert(trn("You have a new mail", "You have got %1 new mails", newMails));
}

