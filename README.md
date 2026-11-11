# NEXT 15기 x Lattice 기업 과제 데모 페이지

NEXT 15기 x Lattice 기업 과제에서 만든 피드백 채팅 SDK를 붙여 볼 예시 고객사 페이지입니다.

![데모 페이지 화면](docs/screenshot.png)

## 사용 방법

1. 이 레포를 포크합니다.
2. 루트의 `index.html` 아래쪽 주석을 풀고, 스크립트 주소를 팀 SDK 주소로 바꿉니다.

```html
<script src="배포한 SDK 스크립트 주소"></script>
```

3. SDK 앱과 **다른 주소**에 배포합니다. Vercel에서 새 프로젝트를 만들어 포크한 레포를 연결하면 됩니다. 빌드 과정이 없는 정적 페이지라 설정은 기본값 그대로 두면 됩니다.

## 로컬에서 보기

```bash
npx serve .
```

## 알아 둘 것

- 로그인한 사용자 정보는 `window.DEMO_USER`에 있습니다. SDK에 사용자 정보를 넘길 때 쓰세요.
- 바꿀 곳은 루트 `index.html`의 SDK 스크립트 한 줄뿐입니다. `assets/`는 빌드 결과물이라 수정하지 않습니다.
- `source/`는 이 페이지의 React 소스입니다. 래티스 디자인시스템 패키지가 비공개라 직접 빌드할 수는 없고, 참고용입니다.

## 데모 녹화용 설정 (피드백 SDK)

이 포크에는 제품 데모를 위해 아래 변경이 들어 있습니다.

- `index.html` 아래쪽에 SDK 한 줄 연동이 추가되어 있습니다. 기본값은 로컬 SDK 앱(`http://localhost:3000/sdk.js`)입니다. 배포한 SDK를 쓰려면 `src`만 배포 주소로 바꾸세요.

```html
<script src="https://배포한-sdk-주소/sdk.js"></script>
<script>Feedback.init({ projectKey: 'lattice-demo', user: window.DEMO_USER });</script>
```

- 고객이 화면을 녹화하며 설명할 버그 3개를 일부러 심어 두었습니다. `node scripts/plant-demo-bugs.mjs`로 다시 심을 수 있고(여러 번 실행해도 결과가 같습니다), `git checkout assets/`로 원복합니다.

| 구분 | 증상 | 변경 위치 |
| --- | --- | --- |
| 명확한 버그 A | "계약서 등록" 버튼을 눌러도 반응이 없음 | `assets/index-CD78DD9U.js`의 버튼 `onClick`을 빈 함수로 교체 |
| 명확한 버그 B | 표 머리글 "계약 금액"이 "계약 긍액"으로 보임 | `assets/index-CD78DD9U.js`의 컬럼 이름 교체 |
| 애매한 버그 C | "전체 계약서" 제목만 굵고 자간이 좁아 이상해 보임 | `assets/index-DN910HHQ.css` 맨 아래에 규칙 추가 |

- 위 변경은 SDK 위젯이 놓이는 오른쪽 아래 영역과 겹치지 않고, 페이지를 새로 고치지 않고도 재현됩니다.
- 기대 이슈 목록은 `feedback-sdk/fixtures/demo-recording/expected.json`, 녹화용 대본은 `feedback-sdk/docs/demo-script.md`에 있습니다.
