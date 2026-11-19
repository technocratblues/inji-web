import { SelectedSdClaimsMap, WalletCredential } from "../../../types/data";
import { DcqlCredentialActionVariant } from "./DcqlCredentialOptionCard";

type CredentialWithFormat = Pick<WalletCredential, "format"> | { format?: string };

const SD_JWT_CREDENTIAL_FORMATS = new Set(["dc+sd-jwt", "vc+sd-jwt"]);
const MDOC_CREDENTIAL_FORMAT = "mso_mdoc";

export function isSdJwtCredential(credential: CredentialWithFormat): boolean {
    const format = credential.format;
    return format !== undefined && SD_JWT_CREDENTIAL_FORMATS.has(format);
}

export function isMdocCredential(credential: CredentialWithFormat): boolean {
    return credential.format === MDOC_CREDENTIAL_FORMAT;
}

export function isSelectivelyDisclosableCredential(credential: CredentialWithFormat): boolean {
    return isSdJwtCredential(credential) || isMdocCredential(credential);
}

export function getCredentialActionVariant(
    credential: WalletCredential
): DcqlCredentialActionVariant {
    if (isSelectivelyDisclosableCredential(credential)) {
        return "shareableFields";
    }

    return "viewCard";
}

export function buildMdocDefaultSdClaims(
    credentials: WalletCredential[]
): SelectedSdClaimsMap {
    const defaults: SelectedSdClaimsMap = {};
    credentials.forEach((credential) => {
        if (
            isMdocCredential(credential) &&
            Array.isArray(credential.sdClaims) &&
            credential.sdClaims.length > 0
        ) {
            defaults[credential.credentialId] = credential.sdClaims;
        }
    });
    return defaults;
}
