/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const cp = require("child_process")
const fs = require("fs")
const path = require("path")
const logger = console

// main
;(ruleId => {
    if (ruleId == null) {
        logger.error("Usage: npm run new <RuleID>")
        process.exitCode = 1
        return
    }
    if (!/^[\w-]+$/u.test(ruleId)) {
        logger.error("Invalid RuleID '%s'.", ruleId)
        process.exitCode = 1
        return
    }

    const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleId}.js`)
    const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleId}.js`)
    const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`)

    fs.writeFileSync(
        ruleFile,
        `/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

module.exports = {
    meta: {
        docs: {
            description: "",
            category: "",
            recommended: false,
            url: "",
        },
        fixable: null,
        schema: [],
        messages: {
            forbidden: "",
        },
    },
    create(context) {
        return {}
    },
}
`
    )
    fs.writeFileSync(
        testFile,
        `/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("../../tester")
const rule = require("../../../lib/rules/${ruleId}.js")

new RuleTester().run("${ruleId}", rule, {
    valid: [],
    invalid: [],
})
`
    )
    fs.writeFileSync(
        docFile,
        `#  (es/${ruleId})

This rule reports ??? as errors.

## Examples

⛔ Examples of **incorrect** code for this rule:

\`\`\`js
\`\`\`
`
    )

    cp.execSync(`code "${ruleFile}"`)
    cp.execSync(`code "${testFile}"`)
    cp.execSync(`code "${docFile}"`)
})(process.argv[2])
