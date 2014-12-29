#!/usr/local/bin/hsscript -f

hsuser(arguments);

function getParam(paramName, paramsString) {
  re = new RegExp(paramName + "\=\"([^\"]*)\"");
  matches = re.exec(paramsString);
  if (matches != null) {
    return matches[1];
  } else {
    return null;
  }
}

function hsuser(args) {
  reader = new java.io.BufferedReader(new java.io.FileReader(args[0]));
  params = reader.readLine();
  reader.close();
  username = getParam("name", params);
  if (username == null) {
    print('failed=True msg="parameter name required"');
    return;
  }
  passwd = getParam("password", params);
  if (passwd == null) {
    print('failed=True msg="parameter password required"');
    return;
  }
  shouldExist = getParam("exists", params);
  if (shouldExist == null) {
    print('failed=True msg="parameter exists with value true or false required"');
    return;
  }
  existingUsers = user.search({where:{name:username}});
  if ("false".localeCompare(shouldExist)) {
    if (existingUsers.length < 1) {
      user.add({set:{name:username,shell:"/bin/bash",password:passwd}});
      print("changed=True msg=added");
    } else {
      user.update({where:{name:username},set:{password:passwd,shell:"/bin/bash"}});
      print("changed=False msg=updated");
    }
  } else {
    if (existingUsers.length > 0) {
      user.remove({where:{name:username}});
      print("changed=True msg=removed");
    } else {
      print("changed=False msg=absent");
    }
  }
}
