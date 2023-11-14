export interface ICreateSeriesData {
    readonly name: string;
    readonly description: string;
    readonly subjects: string[];
    readonly lang: string;
    readonly creators: string[];
    readonly contributors: string[];
    readonly publishers: string[];
    readonly license: string;
    readonly rights: string;
    readonly acl_name: string;
}