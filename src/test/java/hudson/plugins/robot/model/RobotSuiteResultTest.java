/*
 * Copyright 2008-2014 Nokia Solutions and Networks Oy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package hudson.plugins.robot.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;


class RobotSuiteResultTest {

    @Test
    void shouldAcceptMultipleSuitesAsChildren() {
        RobotSuiteResult result = new RobotSuiteResult();

        //Robot sibling suites should have unique names by definition (directories / files in file system)
        RobotSuiteResult child = new RobotSuiteResult();
        child.setName("child");
        RobotSuiteResult child2 = new RobotSuiteResult();
        child2.setName("child2");

        result.addChild(child);
        result.addChild(child2);

        assertEquals(2, result.getChildSuites().size());
    }

    @Test
    void shouldReturnEmptyCollectionIfNoChildren() {
        RobotSuiteResult result = new RobotSuiteResult();
        assertNotNull(result.getChildSuites(), "Return value was null");
        assertEquals(0, result.getChildSuites().size(), "Collection was not empty");
    }

    @Test
    void shouldReturnChildSuiteByName() {
        RobotSuiteResult result = new RobotSuiteResult();
        RobotSuiteResult child = new RobotSuiteResult();
        child.setName("child");
        result.addChild(child);

        assertEquals(child, result.getSuite("child"));
    }

    @Test
    void shouldReturnTestCaseByName() {
        RobotSuiteResult result = new RobotSuiteResult();
        RobotCaseResult caseResult = new RobotCaseResult();
        caseResult.setName("case1");

        result.addCaseResult(caseResult);
        assertEquals(caseResult, result.getCase("case1"));
    }

    @Test
    void shouldReturnNullIfNoParent() {
        RobotSuiteResult rootResult = new RobotSuiteResult();
        assertNull(rootResult.getParent());
    }

    @Test
    void shouldAcceptMultipleCaseResults() {
        RobotSuiteResult result = new RobotSuiteResult();
        RobotCaseResult caseResult = new RobotCaseResult();
        caseResult.setName("case1");
        RobotCaseResult caseResult2 = new RobotCaseResult();
        caseResult2.setName("case2");

        result.addCaseResult(caseResult);
        result.addCaseResult(caseResult2);

        assertEquals(2, result.getCaseResults().size());
    }

    @Test
    void shouldReturnEmptyCollectionIfNoTestCases() {
        RobotSuiteResult result = new RobotSuiteResult();
        assertNotNull(result.getCaseResults(), "Return value was null");
        assertEquals(0, result.getCaseResults().size(), "Collection was not empty");
    }
}
