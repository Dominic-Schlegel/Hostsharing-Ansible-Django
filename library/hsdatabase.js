#!/usr/local/bin/hsscript -f

hsdatabase(arguments);

function getParam(paramName, paramsString) {
  re = new RegExp(paramName + "\=\"([^\"]*)\"");
  matches = re.exec(paramsString);
  if (matches != null) {
    return matches[1];
  } else {
    return null;
  }
}

function hsdatabase(args) {
  reader = new java.io.BufferedReader(new java.io.FileReader(args[0]));
  params = reader.readLine();
  reader.close();
  instance = getParam("instance", params);
  if (instance == null) {
    print('failed=True msg="parameter instance required", allowed values: mysql, postgresql');
    return;
  }
  var dbusermodule;
  var dbmodule;
  if (!"mysql".localeCompare(instance)) {
	  dbusermodule = mysqluser;
	  dbmodule = mysqldb;
  }
  if (!"postgresql".localeCompare(instance)) {
	  dbusermodule = postgresqluser;
	  dbmodule = postgresqldb;
  }
  if (dbusermodule === undefined || dbmodule === undefined) {
    print('failed=True msg="parameter instance required", allowed values: mysql, postgresql');
    return;
  }
  databasename = getParam("name", params);
  if (databasename == null) {
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
  existingUsers = dbusermodule.search({where:{name:databasename}});
  existingDBs = dbmodule.search({where:{name:databasename}});
  if ("false".localeCompare(shouldExist)) {
    if (existingUsers.length < 1) {
      dbusermodule.add({set:{name:databasename,password:passwd}});
    } else {
      dbusermodule.update({where:{name:databasename},set:{password:passwd}});
    }
    if (existingDBs.length < 1) {
      dbmodule.add({set:{name:databasename,owner:databasename}});
      print("changed=True msg=added");
    } else {
      dbmodule.update({where:{name:databasename},set:{owner:databasename}});
      print("changed=False msg=updated");
    }
  } else {
    if (existingUsers.length > 0) {
      dbmodule.remove({where:{name:databasename}});
      dbusermodule.remove({where:{name:databasename}});
      print("changed=True msg=removed");
    } else {
      print("changed=False msg=absent");
    }
  }
}
