# vz-biblio2json
> No name given yet

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

-     add internal rules to prune small publications -- [Sep 29th 15](../../commit/265d2d5676825250bc3725a0a9868f842ac19677)

# Bug fixes

-     improve diff of bibtexes -- [Sep 29th 15](../../commit/0171910cbfc91b53d00dc2bd8740b236a8e6045c)

# Changes to the build process

-     initial commit -- [Sep 28th 15](../../commit/873fdfc3aabe13df23364b602034999305a5674b)
