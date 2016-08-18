

var modules = [];

function Module() {
     this.moduleName = "";
     this.permission = "";
     this.subcommands = [];

}

function Command(name, prefix, permission, handler) {
    this.name = name;
    this.prefix = prefix;
    this.permission = permission,
    this.handler = handler;
}