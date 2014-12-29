#!/usr/local/bin/hsscript -f

hsdomain(arguments);

function getParam(paramName, paramsString) {
  re = new RegExp(paramName + "\=\"([^\"]*)\"");
  matches = re.exec(paramsString);
  if (matches != null) {
    return matches[1];
  } else {
    return null;
  }
}

function hsdomain(args) {
  reader = new java.io.BufferedReader(new java.io.FileReader(args[0]));
  params = reader.readLine();
  reader.close();
  domainname = getParam("name", params);
  if (domainname == null) {
    print('failed=True msg="parameter name required"');
    return;
  }
  useraccount = getParam("owner", params);
  if (useraccount == null) {
    print('failed=True msg="parameter owner required"');
    return;
  }
  shouldExist = getParam("exists", params);
  if (shouldExist == null) {
    print('failed=True msg="parameter exists with value true or false required"');
    return;
  }
  existingDomains = domain.search({where:{name:domainname}});
  if ("false".localeCompare(shouldExist)) {
    if (existingDomains.length < 1) {
      domain.add({set:{name:domainname,user:useraccount}});
      print("changed=True msg=added");
    } else {
	  if (existingDomains[0].user.localeCompare(useraccount)) {
		print('failed=True msg="domain owner change is not supported"');
	  } else {
		print("changed=False msg=exists");
      }	  
    }
  } else {
    if (existingUsers.length > 0) {
      domain.remove({where:{name:domainname}});
      print("changed=True msg=removed");
    } else {
      print("changed=False msg=absent");
    }
  }
}
