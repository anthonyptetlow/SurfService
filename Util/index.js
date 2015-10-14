function machineEncode(value) {
    return (!value) ? '' : value.trim().replace(/ /g, '-').replace('\'', '-');
}

module.exports = {
	stringToMachineName: machineEncode
};
