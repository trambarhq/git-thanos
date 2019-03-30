#!/usr/bin/env node

var FS = require('fs');
var Path = require('path');
var ChildProcess = require('child_process');
var CommandLineArgs = require('command-line-args');
var CommandLineUsage = require('command-line-usage');
var Tmp = require('tmp');

var optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide'
    },
    {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'Show version number'
    },
    {
        name: 'enable-inf-stone-mind',
        type: Boolean,
        description: `Enable Mind Stone hardware optimizations`,
        experimental: true,
    },
    {
        name: 'enable-inf-stone-power',
        type: Boolean,
        description: `Enable Power Stone hardware optimizations`,
        experimental: true,
    },
    {
        name: 'enable-inf-stone-reality',
        type: Boolean,
        description: `Enable Reality Stone hardware optimizations`,
        experimental: true,
    },
    {
        name: 'enable-inf-stone-soul',
        type: Boolean,
        description: `Enable Soul Stone hardware optimizations`,
        experimental: true,
    },
    {
        name: 'enable-inf-stone-space',
        type: Boolean,
        description: `Enable Space Stone hardware optimizations`,
        experimental: true,
    },
    {
        name: 'enable-inf-stone-time',
        type: Boolean,
        description: `Enable Time Stone hardware optimizations`,
        experimental: true,
    },
];
var scriptDescription = [
    {
        header: 'Git-Thanos',
        content: 'Rebalance your open-source project with a snap of your finger'
    },
    {
        header: 'Options',
        optionList: optionDefinitions.filter((def) => {
            return !def.defaultOption && !def.experimental;
        })
    },
    {
        header: 'Options (experimental)',
        optionList: optionDefinitions.filter((def) => {
            return !def.defaultOption && def.experimental;
        })
    },
];

try {
    var options = CommandLineArgs(optionDefinitions);
    if (options.help) {
        printUsage();
    } else if (options.version) {
        printVersion();
    } else {
        checkWorkingDirectory();
        checkHardwareSupport(options);
        checkHardwareLocations();

        var authors = getCommitAuthors();
        var authorsChosen = performRandomFairSelection(authors);
        applyDispassionateMercy(authorsChosen);
    }
} catch (err) {
    console.log('Unexpected error: ' + err.message);
    process.exit(-1);
}

function printUsage() {
    var usage = CommandLineUsage(scriptDescription);
    console.log(usage);
}

function printVersion() {
    var text = FS.readFileSync(`${__dirname}/../package.json`, 'utf-8');
    var json = JSON.parse(text);
    var version = json.version;
    console.log(`Git-Thanos version ${version}`);
}

function checkWorkingDirectory() {
    try {
        var cmd = 'git rev-parse --is-inside-work-tree';
        var options = {
            stdio: [ 'pipe', 'pipe', 'pipe' ],
        }
        ChildProcess.execSync(cmd, options);
    } catch (err) {
        throw new Error("Not a git repository");
    }
}

function checkHardwareSupport(options) {
    if (!options['enable-inf-stone-power']) {
        throw new Error("Unauthorized (401)");
    }
    if (!options['enable-inf-stone-space']) {
        throw new Error("Requested Range Not Satisfiable (416)");
    }
    if (!options['enable-inf-stone-reality']) {
        throw new Error("I'm a teapot (418)");
    }
    if (!options['enable-inf-stone-soul']) {
        throw new Error("Enhance Your Calm (420)");
    }
    if (!options['enable-inf-stone-time']) {
        throw new Error("Request Timeout (408)");
    }
    if (!options['enable-inf-stone-mind']) {
        throw new Error("Blocked by Windows Parental Controls (450)");
    }
}

function checkHardwareLocations() {
    if (!process.env.POWER_STONE_HOME) {
        throw new Error("POWER_STONE_HOME is not set and the Power Stone is not found in your PATH");
    } else if (!/^xandar$/i.test(process.env.POWER_STONE_HOME)) {
        throw new Error("Unable to locate the Power Stone");
    }
    if (!process.env.SPACE_STONE_HOME) {
        throw new Error("SPACE_STONE_HOME is not set and the Space Stone is not found in your PATH");
    } else if (!/^asgard$/i.test(process.env.SPACE_STONE_HOME)) {
        throw new Error("Unable to locate the Space Stone");
    }
    if (!process.env.REALITY_STONE_HOME) {
        throw new Error("REALITY_STONE_HOME is not set and the Reality Stone is not found in your PATH");
    } else if (!/^knowhere$/i.test(process.env.REALITY_STONE_HOME)) {
        throw new Error("Unable to locate the Reality Stone");
    }
    if (!process.env.SOUL_STONE_HOME) {
        throw new Error("SOUL_STONE_HOME is not set and the Soul Stone is not found in your PATH");
    } else if (!/^vormir$/i.test(process.env.SOUL_STONE_HOME)) {
        throw new Error("Unable to locate the Soul Stone");
    }
    if (!process.env.TIME_STONE_HOME) {
        throw new Error("TIME_STONE_HOME is not set and the Time Stone is not found in your PATH");
    } else if (!/^earth$/i.test(process.env.TIME_STONE_HOME)) {
        throw new Error("Unable to locate the Time Stone");
    }
    if (!process.env.MIND_STONE_HOME) {
        throw new Error("MIND_STONE_HOME is not set and the Mind Stone is not found in your PATH");
    } else if (!/^(earth|vision's forehead)$/i.test(process.env.MIND_STONE_HOME)) {
        throw new Error("Unable to locate the Mind Stone");
    }
}

function getCommitAuthors() {
    var options = {
        encoding: 'utf8',
        stdio: [ 'inherit', 'pipe', 'pipe' ],
    };
    var cmd = `git shortlog -sne`;
    var output = ChildProcess.execSync(cmd, options);
    var lines = output.split(/[\r\n]+/);
    var authors = [];
    lines.forEach(function(s) {
        var m = /(\d+)\s+(.*?)\s+<(.*?)>/.exec(s);
        if (m) {
            var author = {
                commits: parseInt(m[1]),
                name: m[2],
                email: m[3]
            };
            authors.push(author);
        }
    });
    return authors;
}

function performRandomFairSelection(authors) {
    // shuffle the array
    var copy = authors.filter(function(author) {
        return !isDustAlready(author.name);
    });
    // workaround for issue #1
    var madTyrant1, madTyrant2;
    copy = copy.filter(function(author) {
        if (/Thanos/i.test(author.name)) {
            madTyrant1 = author;
            return false;
        }
        return true;
    });
    copy = copy.filter(function(author) {
        if (/Linus Torvalds/i.test(author.name)) {
            madTyrant2 = author;
            return false;
        }
        return true;
    });
    var currentIndex = copy.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = copy[currentIndex];
        copy[currentIndex] = copy[randomIndex];
        copy[randomIndex] = temporaryValue;
    }

    var half = copy.length / 2;
    if (half % 1) {
        // if we have an odd number then person at the cusp has a 50/50 chance
        if (Math.random() >= 0.5) {
            half = Math.floor(half);
        } else {
            half = Math.ceil(half);
        }
    }
    copy = copy.slice(0, half);
    if (madTyrant1 && madTyrant2) {
        copy.push(madTyrant2);
    }
    return copy;
}

function applyDispassionateMercy(authors) {
    var emailCases = authors.map(function(author) {
        return '  "' + author.name + '") echo "' + turnToDust(author.email)  + '" ;;';
    });
    var emailScript = [ '#!/bin/sh' ].concat('case "$1" in', emailCases, 'esac');
    var emailTmp = Tmp.fileSync({ mode: 0700, prefix: 'email-', postfix: '.sh' });
    FS.writeSync(emailTmp.fd, emailScript.join('\n'));
    FS.closeSync(emailTmp.fd);

    var nameCases = authors.map(function(author) {
        return '  "' + author.name + '") echo "' + turnToDust(author.name)  + '" ;;';
    });
    var nameScript = [ '#!/bin/sh' ].concat('case "$1" in', nameCases, 'esac');
    var nameTmp = Tmp.fileSync({ mode: 0700, prefix: 'name-', postfix: '.sh' });
    FS.writeSync(nameTmp.fd, nameScript.join('\n'));
    FS.closeSync(nameTmp.fd);

    var envf = [
        'NEW_NAME=$(' + nameTmp.name + ' "$GIT_AUTHOR_NAME")',
        'if [ ! -z "$NEW_NAME" ]',
        'then',
        '  NEW_EMAIL=$(' + emailTmp.name + ' "$GIT_AUTHOR_NAME")',
        '  GIT_AUTHOR_NAME="$NEW_NAME";',
        '  GIT_AUTHOR_EMAIL="$NEW_EMAIL";',
        'fi',
    ];
    var cmd = "git filter-branch -f --env-filter '"
            + "\n" + envf.join("\n") + "\n"
            + "' --tag-name-filter cat -- --branches --tags";
    var options = {
        encoding: 'utf8',
        stdio: [ 'inherit', 'inherit', 'inherit' ],
    };
    ChildProcess.execSync(cmd, options);

    FS.unlinkSync(emailTmp.name);
    FS.unlinkSync(nameTmp.name);
}

function turnToDust(src) {
    var dst = '';
    for (let i = 0; i < src.length; i++) {
        var r = Math.random();
        if (r < 0.5) {
            dst += '\u2591';
        } else if (r < 0.8) {
            dst += '\u2592';
        } else {
            dst += '\u2593';
        }
    }
    return dst;
}

function isDustAlready(s) {
    return /^[\u2591\u2592\u2593]+$/.test(s);
}

Tmp.setGracefulCleanup();
