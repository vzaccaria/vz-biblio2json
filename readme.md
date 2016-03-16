# vz-biblio2json
> A swiss knife tool to convert bibtex to json

## Install

Install it with

```
npm install vz-biblio2json
```
## Usage

```
Usage:
    vz-biblio2json summary <file>
    vz-biblio2json convert <file>
    vz-biblio2json check <file1> <file2> [ -a <json> ]
    vz-biblio2json ( -h | --help )

Options:
    -h, --help              help for vz-biblio2json
    -a, --adjust <json>     adjust rules as a json file

Commands:
    convert                 convert BIBFILE to JSON
    summary                 summarizes data in BIBFILE (for tests)
    check                   checks if the two biblios are the same

```

## Author

* Vittorio Zaccaria

## License
Released under the BSD License.

***



# New features

-     post process json for better integration with liquid -- [Jan 21st 16](../../commit/b9cfb71dcdde501d253a20b2bcfdac19c9ad8300)
-     add internal rules to prune small publications -- [Sep 29th 15](../../commit/265d2d5676825250bc3725a0a9868f842ac19677)

# Bug fixes

-     remove readLocal -- [Mar 16th 16](../../commit/9d5963c1f30188eb6b9c828e775adf13f763a4cd)
-     add missing test directory -- [Mar 1st 16](../../commit/c22fe2e08aadb4c505233b5e1c8a40844c049951)
-     add lodash dependency -- [Mar 1st 16](../../commit/0ee7b6b9b4f2525a6e747af27131dcbc45721ad2)
-     env setup for continuous development tests -- [Mar 1st 16](../../commit/18e6cd2d05168c8f4884b5d87a8114cfdcfc0eaa)
-     add debug package -- [Feb 25th 16](../../commit/854d5bd1de29768ff8577fe1d97d114628a1f84c)
-     dietrofront on shelljs -- [Feb 25th 16](../../commit/907aa12ee8ef23735bc0ac1a970795bcbc2186ed)
-     issue with shelljs returning an array instead of a value -- [Feb 25th 16](../../commit/c8e73162e3077bae5173acab59b3526d85390b7f)
-     improve diff of bibtexes -- [Sep 29th 15](../../commit/0171910cbfc91b53d00dc2bd8740b236a8e6045c)

# Changes to the build process

-     initial commit -- [Sep 28th 15](../../commit/873fdfc3aabe13df23364b602034999305a5674b)
