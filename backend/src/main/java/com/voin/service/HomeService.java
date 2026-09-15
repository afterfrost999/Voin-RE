package com.voin.service;

import com.voin.entity.Card;
import com.voin.entity.Coin;
import com.voin.entity.Keyword;
import com.voin.entity.Member;
import com.voin.repository.CardRepository;
import com.voin.repository.CoinRepository;
import com.voin.repository.MemberCoinRepository;
import com.voin.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 홈 화면에 필요한 실제 코인 통계를 제공하는 서비스.
 * member_coins(보유 현황)와 cards(획득 이력) 기준으로 집계한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HomeService {

    private final MemberCoinRepository memberCoinRepository;
    private final CoinRepository coinRepository;
    private final CardRepository cardRepository;
    private final MemberRepository memberRepository;

    private UUID currentMemberId() {
        return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    /**
     * 홈 코인 요약: 총 보유 개수, 보유 코인 종류 수, 가장 많이 보유한 코인, 가장 최근에 찾은 코인.
     */
    public Map<String, Object> getCoinSummary() {
        UUID memberId = currentMemberId();

        Map<String, Object> result = new HashMap<>();
        result.put("totalCoinCount", memberCoinRepository.getTotalCoinCountByMemberId(memberId));
        result.put("coinTypeCount", memberCoinRepository.getCoinTypesCountByMemberId(memberId));

        // 사용자의 카드(획득 이력)를 최신순으로 로드 — 아이콘용 대표 키워드 산출에 재사용
        Member member = memberRepository.findById(memberId).orElse(null);
        List<Card> cards = member != null
                ? cardRepository.findByOwnerOrderByCreatedAtDesc(member)
                : List.of();

        // 가장 많이 보유한 코인 (+ 대표 키워드 = 그 코인에서 획득한 가장 최근 카드의 키워드)
        memberCoinRepository.findTopCoinByMemberId(memberId).ifPresent(mc ->
                coinRepository.findById(mc.getCoinId()).ifPresent(coin -> {
                    Map<String, Object> most = new HashMap<>();
                    most.put("coinId", coin.getId());
                    most.put("coinName", coin.getName());
                    most.put("count", mc.getCount());
                    most.put("color", coin.getColor());
                    cards.stream()
                            .map(Card::getKeyword)
                            .filter(k -> k != null && k.getCoin() != null
                                    && k.getCoin().getId().equals(coin.getId()))
                            .findFirst()
                            .ifPresent(k -> most.put("keyword", k.getName()));
                    result.put("mostOwnedCoin", most);
                }));

        // 가장 최근에 찾은 코인 (가장 최근 카드의 키워드/코인)
        if (!cards.isEmpty()) {
            Keyword kw = cards.get(0).getKeyword();
            if (kw != null && kw.getCoin() != null) {
                Coin coin = kw.getCoin();
                Map<String, Object> recent = new HashMap<>();
                recent.put("coinId", coin.getId());
                recent.put("coinName", coin.getName());
                recent.put("keyword", kw.getName());
                recent.put("color", coin.getColor());
                result.put("recentCoin", recent);
            }
        }

        return result;
    }
}
