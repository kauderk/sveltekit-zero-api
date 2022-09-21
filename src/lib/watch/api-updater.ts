import { pathToImportPath, toValidVariable } from '../utils/string.js'
import fs from 'fs'
import { resolve } from 'path'
import { debugging } from '$lib/internal.js'
import type { WatchOptions } from './types'

const cwd = process.cwd()

/** Is run when file changes has been detected */
export function apiUpdater(
	watchOptions: WatchOptions,
	/** Resolved to real path i.e. `src/routes = C:/current/project/src/routes` */
	watchDirectory: string
) {
	type Directory = { [key: string]: string | Directory }
	const apiTypes: Directory = {}
	let importStatements = ''
	function recursiveLoad(dir: string, directory: Directory) {
		const files = fs.readdirSync(dir)

		// ex. src/routes/api/somedir/index.ts
		for (const fileName of files) {
			const path = resolve(dir, fileName)
			const metadata = fs.statSync(path)

			if (metadata.isDirectory()) {
				if (!directory[fileName])
					directory[fileName] = {}
				recursiveLoad(path, directory[fileName] as Directory)
				continue
			}

			if (!/\+server.(ts|js)/gm.test(fileName))
				continue

			const importName = pathToImportPath(path)
			const name = toValidVariable(importName)
			importStatements += `import * as ${name} from "${importName}";\n`

			const key = fileName.replace(/\.(ts|js)$/g, '')
			const index = key.startsWith('index')
			directory[key] = `Z<typeof ${name}>`
		}
	}
	recursiveLoad(watchDirectory, apiTypes)

	let dirText = JSON.stringify(apiTypes, null, 2)
		
	
	dirText = dirText
		// Transform routes into API types
		.replaceAll(/\"\+server\"\: \"Z/g, '} & Z')
		.replaceAll(/(__server\>\",)|(__server\>\")/g, '__server> & {')
		
		// Transform slugs e.g. "[slug]": into functions slug$: (slug: S) =>
		// TODO: Allow ex. [slug].[second] to become slug$second$: (slug: S, second: S) =>
		.replaceAll(/\"\[(.*?)\]\"\:/g, '$1$: ($1: S) =>')

	const { tempOutput, outputDir = 'src' } = watchOptions
	const resolution = tempOutput ?
		resolve(cwd, tempOutput) : resolve(cwd, '.svelte-kit', 'types', outputDir, 'sveltekit-zero-api.d.ts')

	if (!fs.existsSync(resolution))
		fs.mkdirSync(resolution, { recursive: true })
	
	debugging && console.log(`[DEBUG] Updating generated types at ${resolution} ...`)
	
	try {
		// Flag is required to make it a writeable stream. Replacing file messes with TypeScript.
		fs.writeFileSync(resolution, file(dirText, importStatements), { flag: 'w+' })
	} catch (error) {
		console.warn(error)
	}
}

const file = (dirText: string, importCode: string) =>
	`/* eslint-disable */
/* 
    -- Generated sveltekit-zero-api --
          Do not edit this file
*/
import type { Z } from 'sveltekit-zero-api/types/zeroapi'
${importCode}

type S = string | number 
export type GeneratedAPI = ${dirText}`