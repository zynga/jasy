function wrapper()
{
  alert(this.tr("Hello World"));
  alert(tr("Short"));
  alert(qx.locale.Manager.getInstance().tr("Thank you for the flowers"));
  
  alert(tr("Guten {0}", "Morgen"))
  alert(tr("Guten {0}! {0}!", "Morgen"))

  alert(trc("Chat (noum)", "Chat"));
  alert(trc("Chat (noum) {0}", "Chat {0}", "Online"));

  alert(trn("You have got a new mail", "You have got new mails", newMails));
  alert(trn("You have got a new mail", "You have got {0} new mails", newMails, newMails));
}

