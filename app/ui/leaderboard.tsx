/** @jsxImportSource frog/jsx */
import { Fan } from '../utils/interface'
import { Box } from '../api/[[...routes]]/ui'

export function getLeaderboardImage(topTen: Fan[]) {
    return (
        <Box
            grow
            alignVertical="center"
            padding="10"
            paddingBottom="26"
            marginTop="2"
            marginBottom="2"
            fontWeight="700"
        >   
            <img
                src="/Top10Fans.png"
            />
            {_renderFanData(topTen)}
        </Box>
    )
}

function _renderFanData(topTen: Fan[]) {
    return (
        <div
            style={{
                position: 'absolute',
                display: 'flex',
                top: 0,
                left: 320,
                width: '28%',
                color: 'black',
                fontSize: 15,
                fontWeight: 900,
                fontFamily: 'coinbase',
            }}
        >
            
            {topTen.slice(0, 10).map((fan, index) => (
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                top: `${835 + index * 37}px`,
                            }}
                        >
                            {'@' + fan.display_name}
                        </div>
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                top: `${835 + index * 37}px`,
                                left: '370',
                            }}
                        >
                            {fan.score}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                top: `${835 + index * 37}px`,
                                left: '475',
                            }}
                        >
                            {fan.recasts}
                        </div>
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                display: 'flex',
                                top: `${835 + index * 37}px`,
                                left: '580',
                            }}
                        >
                            {fan.reactions}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
    
}