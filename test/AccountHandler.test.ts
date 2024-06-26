import config from './config'
import { Account, Time, Request, DecodeTokenResponse } from "../src/index"


if(config.test.accountModule.runTests) {
    describe('Account module tests', () => {
    
        test('convertPassphraseToPublicKey', () => {
            const pubKey = Account.convertPassphraseToPublicKey(config.account.alice.secret);
            expect(pubKey).toBe(config.account.alice.pubKey.hex);
            
            const pubKeyBytes = Account.convertPassphraseToPublicKey(config.account.alice.secret, true);
            expect(String(pubKeyBytes)).toBe(String(config.account.alice.pubKey.bytes));
        });


        test('convertPublicKeyToAccountId', () => {
            const accountId = Account.convertPublicKeyToAccountId(config.account.alice.pubKey.hex);
            expect(accountId).toBe(config.account.alice.id);
        });


        test('convertPublicKeyToAccountRs', () => {
            const accountRs = Account.convertPublicKeyToAccountRs(config.account.alice.pubKey.hex);
            expect(accountRs).toBe(config.account.alice.address);
        });


        if(config.test.accountModule.generateToken) {
            test('generateToken testnet', async () => {
                const timeWindow = 10 * 1000; // 10 sec
                const currentTime = Date.now();

                const token = Account.generateToken('test', config.account.alice.secret, true);
                const response = await Request.decodeToken(config.node.url.testnet, { data: 'test', token: token});

                const typedResponse = response as DecodeTokenResponse;
                expect(typedResponse.valid).toBe(true);
                expect(typedResponse.accountRS).toBe(config.account.alice.address);

                /* check if token was created currently (+/- 10 sec) */
                const tokenCreationTime = Time.convertArdorToUnixTimestamp(typedResponse.timestamp, true);
                expect(tokenCreationTime + timeWindow).toBeGreaterThan(currentTime);
                expect(tokenCreationTime - timeWindow).toBeLessThan(currentTime);
            });


            test('generateToken mainnet', async () => {
                const timeWindow = 10 * 1000; // 10 sec
                const currentTime = Date.now();

                const token = Account.generateToken('test', config.account.alice.secret);
                const response = await Request.decodeToken(config.node.url.mainnet, { data: 'test', token: token});

                const typedResponse = response as DecodeTokenResponse;
                expect(typedResponse.valid).toBe(true);
                expect(typedResponse.accountRS).toBe(config.account.alice.address);

                /* check if token was created currently (+/- 10 sec) */
                const tokenCreationTime = Time.convertArdorToUnixTimestamp(typedResponse.timestamp);
                expect(tokenCreationTime + timeWindow).toBeGreaterThan(currentTime);
                expect(tokenCreationTime - timeWindow).toBeLessThan(currentTime);
            });
        }

    });       
} else {
    test('dummy', () => { 
        expect(true).toBeTruthy(); 
    });
}